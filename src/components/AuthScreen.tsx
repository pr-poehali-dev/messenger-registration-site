import { useState } from 'react';
import Icon from '@/components/ui/icon';

const SMS_URL = 'https://functions.poehali.dev/22f2b439-8abf-4e64-9932-31c11634d035';

interface AuthScreenProps {
  onAuth: (user: { name: string; phone: string; avatar: string }) => void;
}

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [step, setStep] = useState<'phone' | 'code' | 'name'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '');
    if (digits.length === 0) return '';
    let result = '+7';
    if (digits.length > 1) result += ' (' + digits.slice(1, 4);
    if (digits.length >= 4) result += ') ' + digits.slice(4, 7);
    if (digits.length >= 7) result += '-' + digits.slice(7, 9);
    if (digits.length >= 9) result += '-' + digits.slice(9, 11);
    return result;
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const limited = raw.startsWith('7') ? raw.slice(0, 11) : '7' + raw.slice(0, 10);
    setPhone(formatPhone(limited));
    setError('');
  };

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const handleSendCode = async () => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 11) { setError('Введите полный номер телефона'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(SMS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', phone }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Ошибка отправки'); return; }
      setStep('code');
      startResendTimer();
    } catch {
      setError('Нет соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) { setError('Введите 6-значный код'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(SMS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', phone, code }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Неверный код'); return; }
      setStep('name');
    } catch {
      setError('Нет соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setCode('');
    setError('');
    setLoading(true);
    try {
      const res = await fetch(SMS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', phone }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Ошибка отправки'); return; }
      startResendTimer();
    } catch {
      setError('Нет соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    if (name.trim().length >= 2) {
      const initials = name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
      onAuth({ name: name.trim(), phone, avatar: initials });
    } else {
      setError('Введите имя (минимум 2 символа)');
    }
  };

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4 font-golos">
      <div className="fixed top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20 animate-float"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.6) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      <div className="fixed bottom-1/3 right-1/4 w-48 h-48 rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, rgba(6,214,245,0.6) 0%, transparent 70%)', filter: 'blur(30px)' }} />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl gradient-primary mb-4 neon-glow-purple">
            <Icon name="Zap" size={36} className="text-white" />
          </div>
          <h1 className="text-4xl font-black gradient-text tracking-tight">Pulse</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Мессенджер нового поколения</p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-3xl p-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl mb-4 text-sm animate-fade-in"
              style={{ background: 'rgba(247,37,133,0.1)', border: '1px solid rgba(247,37,133,0.3)', color: '#f72585' }}>
              <Icon name="AlertCircle" size={14} />
              {error}
            </div>
          )}

          {step === 'phone' && (
            <div>
              <h2 className="text-xl font-bold mb-1 text-white">Войти по номеру</h2>
              <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>Введите ваш номер телефона</p>
              <div className="mb-4">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Icon name="Phone" size={16} style={{ color: 'var(--neon-purple)' }} />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneInput}
                    onKeyDown={e => e.key === 'Enter' && handleSendCode()}
                    placeholder="+7 (___) ___-__-__"
                    className="w-full pl-10 pr-4 py-4 rounded-2xl text-white outline-none transition-all text-base font-mono"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(168,85,247,0.3)', color: 'white' }}
                    onFocus={e => (e.target.style.borderColor = 'rgba(168,85,247,0.8)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(168,85,247,0.3)')}
                  />
                </div>
              </div>
              <button
                onClick={handleSendCode}
                disabled={loading}
                className="w-full py-4 rounded-2xl font-bold text-white transition-all duration-200 text-base flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #a855f7 0%, #06d6f5 100%)', boxShadow: '0 4px 24px rgba(168,85,247,0.4)', opacity: loading ? 0.7 : 1 }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}>
                {loading ? <><Icon name="Loader2" size={18} className="animate-spin" /> Отправляем...</> : 'Получить код'}
              </button>
            </div>
          )}

          {step === 'code' && (
            <div>
              <button onClick={() => { setStep('phone'); setError(''); }} className="flex items-center gap-2 mb-5 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                <Icon name="ArrowLeft" size={14} /> Назад
              </button>
              <h2 className="text-xl font-bold mb-1 text-white">Введите код</h2>
              <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Отправили SMS на <span style={{ color: 'var(--neon-cyan)' }}>{phone}</span>
              </p>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={e => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleVerifyCode()}
                placeholder="000000"
                className="w-full text-center py-4 rounded-2xl text-white text-2xl font-mono outline-none mb-4 transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(6,214,245,0.3)', letterSpacing: '0.4em' }}
                onFocus={e => (e.target.style.borderColor = 'rgba(6,214,245,0.8)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(6,214,245,0.3)')}
              />
              <button
                onClick={handleVerifyCode}
                disabled={loading}
                className="w-full py-4 rounded-2xl font-bold text-white transition-all duration-200 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #06d6f5 0%, #a855f7 100%)', boxShadow: '0 4px 24px rgba(6,214,245,0.35)', opacity: loading ? 0.7 : 1 }}>
                {loading ? <><Icon name="Loader2" size={18} className="animate-spin" /> Проверяем...</> : 'Подтвердить'}
              </button>
              <p className="text-center text-xs mt-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Не пришёл код?{' '}
                <button
                  onClick={handleResend}
                  disabled={resendTimer > 0}
                  className="underline transition-all"
                  style={{ color: resendTimer > 0 ? 'rgba(255,255,255,0.25)' : 'var(--neon-purple)', cursor: resendTimer > 0 ? 'default' : 'pointer' }}>
                  {resendTimer > 0 ? `Повторно через ${resendTimer}с` : 'Отправить снова'}
                </button>
              </p>
            </div>
          )}

          {step === 'name' && (
            <div>
              <h2 className="text-xl font-bold mb-1 text-white">Ваше имя</h2>
              <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>Как вас будут видеть другие</p>
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleFinish()}
                placeholder="Имя и фамилия"
                className="w-full px-4 py-4 rounded-2xl text-white outline-none mb-4 transition-all text-base"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(0,245,212,0.3)' }}
                onFocus={e => (e.target.style.borderColor = 'rgba(0,245,212,0.8)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(0,245,212,0.3)')}
              />
              <button
                onClick={handleFinish}
                className="w-full py-4 rounded-2xl font-bold text-white transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #00f5d4 0%, #a855f7 100%)', boxShadow: '0 4px 24px rgba(0,245,212,0.35)' }}>
                Начать общение
              </button>
            </div>
          )}
        </div>

        {/* Steps indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {['phone', 'code', 'name'].map((s) => (
            <div key={s} className="h-1 rounded-full transition-all duration-300"
              style={{ width: step === s ? '24px' : '8px', background: step === s ? 'var(--neon-purple)' : 'rgba(255,255,255,0.15)' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
