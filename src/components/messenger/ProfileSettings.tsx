import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface ProfileSettingsProps {
  user: { name: string; phone: string; avatar: string };
  onClose: () => void;
  onLogout: () => void;
}

export default function ProfileSettings({ user, onClose, onLogout }: ProfileSettingsProps) {
  const [tab, setTab] = useState<'profile' | 'settings'>('profile');
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState('dark');

  return (
    <div className="flex flex-col h-full animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between p-5 pb-4 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex gap-1 p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {(['profile', 'settings'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: tab === t ? 'linear-gradient(135deg, #a855f7, #06d6f5)' : 'transparent',
                color: tab === t ? 'white' : 'rgba(255,255,255,0.5)',
              }}>
              {t === 'profile' ? 'Профиль' : 'Настройки'}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          <Icon name="X" size={15} style={{ color: 'rgba(255,255,255,0.5)' }} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === 'profile' && (
          <div className="p-5">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-3">
                <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-2xl font-black text-white"
                  style={{ background: 'linear-gradient(135deg, #a855f7, #06d6f5)', boxShadow: '0 0 30px rgba(168,85,247,0.5)' }}>
                  {user.avatar}
                </div>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #a855f7, #06d6f5)' }}>
                  <Icon name="Camera" size={14} className="text-white" />
                </button>
              </div>
              <h2 className="text-xl font-black text-white">{user.name}</h2>
              <p className="text-sm mt-0.5" style={{ color: 'var(--neon-green)' }}>● онлайн</p>
            </div>

            {/* Info */}
            {[
              { icon: 'Phone', label: 'Телефон', value: user.phone, color: 'var(--neon-green)' },
              { icon: 'AtSign', label: 'Юзернейм', value: '@' + user.name.split(' ')[0].toLowerCase(), color: 'var(--neon-cyan)' },
              { icon: 'Info', label: 'О себе', value: 'Доступен', color: 'var(--neon-purple)' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-4 p-4 rounded-2xl mb-2 group cursor-pointer transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Icon name={item.icon} size={16} style={{ color: item.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.label}</p>
                  <p className="text-sm font-medium text-white">{item.value}</p>
                </div>
                <Icon name="ChevronRight" size={14} style={{ color: 'rgba(255,255,255,0.2)' }} />
              </div>
            ))}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {[
                { label: 'Чатов', value: '5' },
                { label: 'Контактов', value: '5' },
                { label: 'Групп', value: '2' },
              ].map(stat => (
                <div key={stat.label} className="p-3 rounded-2xl text-center"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-xl font-black gradient-text">{stat.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div className="p-5 space-y-2">
            <p className="text-xs font-bold px-1 mb-3" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Уведомления</p>

            {[
              { icon: 'Bell', label: 'Уведомления', desc: 'Push-уведомления', value: notifications, set: setNotifications, color: 'var(--neon-purple)' },
              { icon: 'Volume2', label: 'Звук', desc: 'Звук сообщений', value: soundEnabled, set: setSoundEnabled, color: 'var(--neon-cyan)' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-4 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <Icon name={item.icon} size={15} style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{item.label}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{item.desc}</p>
                  </div>
                </div>
                <button onClick={() => item.set(!item.value)}
                  className="w-12 h-6 rounded-full transition-all duration-200 relative"
                  style={{ background: item.value ? 'linear-gradient(135deg, #a855f7, #06d6f5)' : 'rgba(255,255,255,0.1)' }}>
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-200"
                    style={{ left: item.value ? '28px' : '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
                </button>
              </div>
            ))}

            <p className="text-xs font-bold px-1 mb-3 mt-4" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Тема</p>

            <div className="flex gap-2 p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
              {['dark', 'midnight', 'space'].map(t => (
                <button key={t} onClick={() => setTheme(t)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{
                    background: theme === t ? 'linear-gradient(135deg, #a855f7, #06d6f5)' : 'transparent',
                    color: theme === t ? 'white' : 'rgba(255,255,255,0.4)',
                  }}>
                  {t === 'dark' ? '🌙 Тёмная' : t === 'midnight' ? '🔮 Полночь' : '🚀 Космос'}
                </button>
              ))}
            </div>

            <p className="text-xs font-bold px-1 mb-3 mt-4" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Аккаунт</p>

            {[
              { icon: 'Shield', label: 'Приватность', color: 'var(--neon-green)' },
              { icon: 'Key', label: 'Безопасность', color: 'var(--neon-cyan)' },
              { icon: 'HelpCircle', label: 'Помощь', color: 'rgba(255,255,255,0.5)' },
            ].map(item => (
              <button key={item.label} className="w-full flex items-center gap-3 p-4 rounded-2xl text-left transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Icon name={item.icon} size={15} style={{ color: item.color }} />
                </div>
                <span className="text-sm font-medium text-white flex-1">{item.label}</span>
                <Icon name="ChevronRight" size={14} style={{ color: 'rgba(255,255,255,0.2)' }} />
              </button>
            ))}

            <button onClick={onLogout}
              className="w-full flex items-center gap-3 p-4 rounded-2xl text-left transition-all mt-2"
              style={{ background: 'rgba(247,37,133,0.08)', border: '1px solid rgba(247,37,133,0.2)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(247,37,133,0.15)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(247,37,133,0.08)')}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(247,37,133,0.1)' }}>
                <Icon name="LogOut" size={15} style={{ color: 'var(--neon-pink)' }} />
              </div>
              <span className="text-sm font-semibold" style={{ color: 'var(--neon-pink)' }}>Выйти из аккаунта</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}