import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { type Chat, type Message } from './data';

interface ChatWindowProps {
  chat: Chat;
  onCall: (type: 'voice' | 'video', chat: Chat) => void;
}

export default function ChatWindow({ chat, onCall }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(chat.messages);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(chat.messages);
  }, [chat.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const msg: Message = {
      id: Date.now(),
      text: input.trim(),
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      out: true,
      read: false,
    };
    setMessages(prev => [...prev, msg]);
    setInput('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold text-white"
            style={{ background: chat.color }}>
            {chat.avatar}
            {chat.online && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
                style={{ background: 'var(--neon-green)', borderColor: 'hsl(225, 20%, 6%)', boxShadow: '0 0 6px rgba(0,245,212,0.8)' }} />
            )}
          </div>
          <div>
            <p className="font-bold text-white text-sm">{chat.name}</p>
            <p className="text-xs">
              {chat.isGroup
                ? <span style={{ color: 'rgba(255,255,255,0.4)' }}>{chat.members} участников</span>
                : chat.online
                  ? <span style={{ color: 'var(--neon-green)' }}>онлайн</span>
                  : <span style={{ color: 'rgba(255,255,255,0.4)' }}>был(а) недавно</span>
              }
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onCall('voice', chat)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ background: 'rgba(0,245,212,0.1)', border: '1px solid rgba(0,245,212,0.2)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,245,212,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,245,212,0.1)')}>
            <Icon name="Phone" size={15} style={{ color: 'var(--neon-green)' }} />
          </button>
          <button onClick={() => onCall('video', chat)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(168,85,247,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(168,85,247,0.1)')}>
            <Icon name="Video" size={15} style={{ color: 'var(--neon-purple)' }} />
          </button>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Icon name="MoreVertical" size={15} style={{ color: 'rgba(255,255,255,0.5)' }} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => (
          <div key={msg.id} className="flex animate-fade-in" style={{ animationDelay: `${i * 0.02}s`, justifyContent: msg.out ? 'flex-end' : 'flex-start' }}>
            {!msg.out && (
              <div className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mr-2 mt-auto mb-1"
                style={{ background: chat.color }}>
                {chat.avatar.slice(0, 1)}
              </div>
            )}
            <div className="max-w-xs lg:max-w-md">
              <div className={`px-4 py-2.5 text-sm text-white ${msg.out ? 'chat-bubble-out' : 'chat-bubble-in'}`}>
                {msg.text}
              </div>
              <div className={`flex items-center gap-1 mt-1 ${msg.out ? 'justify-end' : 'justify-start'}`}>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{msg.time}</span>
                {msg.out && (
                  <Icon name={msg.read ? 'CheckCheck' : 'Check'} size={12}
                    style={{ color: msg.read ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.3)' }} />
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-end gap-3">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            <Icon name="Paperclip" size={16} style={{ color: 'rgba(255,255,255,0.4)' }} />
          </button>
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Написать сообщение..."
              rows={1}
              className="w-full px-4 py-3 rounded-2xl text-sm text-white outline-none resize-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                maxHeight: '120px',
                lineHeight: '1.4',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(168,85,247,0.5)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>
          <button
            onClick={send}
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
            style={{
              background: input.trim() ? 'linear-gradient(135deg, #a855f7, #06d6f5)' : 'rgba(255,255,255,0.06)',
              boxShadow: input.trim() ? '0 4px 16px rgba(168,85,247,0.4)' : 'none',
            }}
            onMouseEnter={e => { if (input.trim()) e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
            <Icon name="Send" size={16} style={{ color: input.trim() ? 'white' : 'rgba(255,255,255,0.3)' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
