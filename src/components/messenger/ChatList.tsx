import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { DEMO_CHATS, type Chat } from './data';

interface ChatListProps {
  activeChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  currentUser: { name: string; avatar: string };
  onOpenContacts: () => void;
}

export default function ChatList({ activeChat, onSelectChat, currentUser, onOpenContacts }: ChatListProps) {
  const [search, setSearch] = useState('');
  const [chats] = useState<Chat[]>(DEMO_CHATS);

  const filtered = chats.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-full" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold text-white cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #a855f7, #06d6f5)' }}>
              {currentUser.avatar}
            </div>
            <div>
              <p className="font-bold text-sm text-white leading-tight">{currentUser.name}</p>
              <p className="text-xs" style={{ color: 'var(--neon-green)' }}>● онлайн</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={onOpenContacts} className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={{ background: 'rgba(255,255,255,0.05)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(168,85,247,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}>
              <Icon name="Users" size={16} style={{ color: 'rgba(255,255,255,0.6)' }} />
            </button>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={{ background: 'rgba(255,255,255,0.05)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(168,85,247,0.2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}>
              <Icon name="Edit3" size={16} style={{ color: 'rgba(255,255,255,0.6)' }} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск чатов..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none text-white transition-all"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          />
        </div>
      </div>

      {/* Chats */}
      <div className="flex-1 overflow-y-auto px-2">
        {filtered.map((chat, i) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className="w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all duration-200 mb-1 animate-fade-in"
            style={{
              animationDelay: `${i * 0.04}s`,
              background: activeChat?.id === chat.id
                ? 'rgba(168,85,247,0.15)'
                : 'transparent',
              border: activeChat?.id === chat.id
                ? '1px solid rgba(168,85,247,0.25)'
                : '1px solid transparent',
            }}
            onMouseEnter={e => {
              if (activeChat?.id !== chat.id) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={e => {
              if (activeChat?.id !== chat.id) e.currentTarget.style.background = 'transparent';
            }}
          >
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold text-white"
                style={{ background: chat.color }}>
                {chat.avatar}
              </div>
              {chat.online && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
                  style={{
                    background: 'var(--neon-green)',
                    borderColor: 'hsl(225, 20%, 6%)',
                    boxShadow: '0 0 6px rgba(0,245,212,0.8)',
                  }} />
              )}
              {chat.isGroup && !chat.online && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: 'hsl(225, 18%, 9%)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Icon name="Users" size={8} style={{ color: 'rgba(255,255,255,0.5)' }} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-semibold text-sm text-white truncate">{chat.name}</span>
                <span className="text-xs flex-shrink-0 ml-2" style={{ color: 'rgba(255,255,255,0.35)' }}>{chat.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>{chat.lastMessage}</span>
                {chat.unread > 0 && (
                  <span className="flex-shrink-0 ml-2 min-w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white px-1.5"
                    style={{ background: 'var(--neon-purple)', boxShadow: '0 0 8px rgba(168,85,247,0.6)' }}>
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
