import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { type Chat } from './data';

interface CallScreenProps {
  chat: Chat;
  type: 'voice' | 'video';
  onEnd: () => void;
}

export default function CallScreen({ chat, type, onEnd }: CallScreenProps) {
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [status, setStatus] = useState<'calling' | 'connected'>('calling');

  useEffect(() => {
    const t = setTimeout(() => setStatus('connected'), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (status !== 'connected') return;
    const t = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(t);
  }, [status]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-golos"
      style={{ background: 'rgba(10,8,20,0.95)', backdropFilter: 'blur(20px)' }}>

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-30"
          style={{ background: `radial-gradient(circle, ${type === 'video' ? 'rgba(6,214,245,0.4)' : 'rgba(0,245,212,0.4)'} 0%, transparent 70%)`, filter: 'blur(60px)' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-8">
        {/* Avatar */}
        <div className="relative mb-6">
          {/* Pulse rings */}
          {status === 'calling' && (
            <>
              <div className="absolute inset-0 rounded-full opacity-40 animate-ping"
                style={{ background: 'rgba(168,85,247,0.3)', animationDuration: '1.5s' }} />
              <div className="absolute -inset-4 rounded-full opacity-20 animate-ping"
                style={{ background: 'rgba(168,85,247,0.2)', animationDuration: '2s', animationDelay: '0.5s' }} />
            </>
          )}
          <div className="relative w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold text-white"
            style={{ background: chat.color, boxShadow: '0 0 40px rgba(168,85,247,0.5)' }}>
            {chat.avatar}
          </div>
          {type === 'video' && (
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #a855f7, #06d6f5)' }}>
              <Icon name="Video" size={14} className="text-white" />
            </div>
          )}
        </div>

        <h2 className="text-2xl font-black text-white mb-2">{chat.name}</h2>
        <p className="text-sm mb-8"
          style={{ color: status === 'connected' ? 'var(--neon-green)' : 'rgba(255,255,255,0.5)' }}>
          {status === 'calling' ? 'Соединение...' : fmt(duration)}
        </p>

        {/* Video preview (mock) */}
        {type === 'video' && !cameraOff && (
          <div className="w-48 h-32 rounded-2xl mb-8 flex items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1a1030, #0a1520)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="text-center">
              <Icon name="Video" size={24} style={{ color: 'rgba(255,255,255,0.2)' }} />
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.2)' }}>Камера</p>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMuted(m => !m)}
            className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200"
            style={{
              background: muted ? 'rgba(247,37,133,0.2)' : 'rgba(255,255,255,0.1)',
              border: `1px solid ${muted ? 'rgba(247,37,133,0.5)' : 'rgba(255,255,255,0.1)'}`,
            }}>
            <Icon name={muted ? 'MicOff' : 'Mic'} size={22}
              style={{ color: muted ? 'var(--neon-pink)' : 'rgba(255,255,255,0.7)' }} />
          </button>

          <button onClick={onEnd}
            className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #f72585, #e63946)',
              boxShadow: '0 4px 24px rgba(247,37,133,0.5)',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
            <Icon name="PhoneOff" size={24} className="text-white" />
          </button>

          {type === 'video' && (
            <button
              onClick={() => setCameraOff(c => !c)}
              className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200"
              style={{
                background: cameraOff ? 'rgba(247,37,133,0.2)' : 'rgba(255,255,255,0.1)',
                border: `1px solid ${cameraOff ? 'rgba(247,37,133,0.5)' : 'rgba(255,255,255,0.1)'}`,
              }}>
              <Icon name={cameraOff ? 'VideoOff' : 'Video'} size={22}
                style={{ color: cameraOff ? 'var(--neon-pink)' : 'rgba(255,255,255,0.7)' }} />
            </button>
          )}

          {type === 'voice' && (
            <button className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Icon name="Volume2" size={22} style={{ color: 'rgba(255,255,255,0.7)' }} />
            </button>
          )}
        </div>

        {/* Wave visualizer */}
        {status === 'connected' && !muted && (
          <div className="flex items-center gap-1 mt-6">
            {[1, 2, 3, 4, 5, 4, 3].map((h, i) => (
              <div key={i} className="wave-bar rounded-full"
                style={{
                  width: '3px',
                  height: `${h * 4}px`,
                  background: 'var(--neon-purple)',
                  animationDelay: `${i * 0.1}s`,
                }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
