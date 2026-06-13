import os
import json
import random
import time
import urllib.request
import urllib.parse

# Хранилище кодов в памяти: phone -> {code, expires}
_codes: dict = {}


def handler(event: dict, context) -> dict:
    """Отправляет SMS с кодом подтверждения на номер телефона через СМС.ру."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': ''
        }

    HEADERS = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }

    body = json.loads(event.get('body') or '{}')
    action = body.get('action')  # 'send' or 'verify'
    phone = body.get('phone', '').replace(' ', '').replace('-', '').replace('(', '').replace(')', '')

    if not phone:
        return {'statusCode': 400, 'headers': HEADERS, 'body': json.dumps({'error': 'Номер телефона обязателен'})}

    # Normalize: ensure starts with 7
    if phone.startswith('+'):
        phone = phone[1:]
    if phone.startswith('8'):
        phone = '7' + phone[1:]

    if action == 'send':
        code = str(random.randint(100000, 999999))
        _codes[phone] = {'code': code, 'expires': time.time() + 300}  # 5 минут

        api_key = os.environ.get('SMSRU_API_KEY', '')
        params = urllib.parse.urlencode({
            'api_id': api_key,
            'to': phone,
            'msg': f'Ваш код Pulse: {code}',
            'json': 1,
        })
        url = f'https://sms.ru/sms/send?{params}'

        try:
            with urllib.request.urlopen(url, timeout=10) as resp:
                result = json.loads(resp.read().decode())
            if result.get('status') == 'OK':
                sms_status = list(result.get('sms', {}).values())
                first = sms_status[0] if sms_status else {}
                if first.get('status') == 'ERROR':
                    return {
                        'statusCode': 400,
                        'headers': HEADERS,
                        'body': json.dumps({'error': first.get('status_text', 'Ошибка отправки')})
                    }
            else:
                return {
                    'statusCode': 400,
                    'headers': HEADERS,
                    'body': json.dumps({'error': result.get('status_text', 'Ошибка API')})
                }
        except Exception as e:
            return {'statusCode': 500, 'headers': HEADERS, 'body': json.dumps({'error': str(e)})}

        return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps({'ok': True})}

    elif action == 'verify':
        code = body.get('code', '')
        entry = _codes.get(phone)
        if not entry:
            return {'statusCode': 400, 'headers': HEADERS, 'body': json.dumps({'error': 'Сначала запросите код'})}
        if time.time() > entry['expires']:
            del _codes[phone]
            return {'statusCode': 400, 'headers': HEADERS, 'body': json.dumps({'error': 'Код истёк, запросите новый'})}
        if entry['code'] != code:
            return {'statusCode': 400, 'headers': HEADERS, 'body': json.dumps({'error': 'Неверный код'})}
        del _codes[phone]
        return {'statusCode': 200, 'headers': HEADERS, 'body': json.dumps({'ok': True, 'phone': phone})}

    return {'statusCode': 400, 'headers': HEADERS, 'body': json.dumps({'error': 'Неизвестное действие'})}
