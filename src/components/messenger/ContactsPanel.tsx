import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { CONTACTS } from './data';

interface ContactsPanelProps {
  onClose: () => void;
  onStartChat: (contactId: number) => void;
}

export default function ContactsPanel({ onClose, onStartChat }: ContactsPanelProps) {
  const [search, setSearch] = useState('');

  const filtered = CONTACTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const grouped = filtered.reduce<Record<string, typeof CONTACTS>>((acc, c) => {
    const letter = c.name[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(c);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between p-5 pb-4 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <h2 className="font-bold text-lg text-white">Контакты</h2>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{CONTACTS.length} человек</p>
        </div>
        <div className="flex gap-2">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.25)' }}>
            <Icon name="UserPlus" size={15} style={{ color: 'var(--neon-purple)' }} />
          </button>
          <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.05)' }}>
            <Icon name="X" size={15} style={{ color: 'rgba(255,255,255,0.5)' }} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 flex-shrink-0">
        <div className="relative">
          <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск контактов..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none text-white"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
          />
        </div>
      </div>

      {/* Create Group */}
      <div className="px-4 mb-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all"
          style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #a855f7, #06d6f5)' }}>
            <Icon name="Users" size={18} className="text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-sm text-white">Создать группу</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Добавить участников</p>
          </div>
          <Icon name="ChevronRight" size={16} className="ml-auto" style={{ color: 'rgba(255,255,255,0.3)' }} />
        </button>
      </div>

      {/* Contacts list */}
      <div className="flex-1 overflow-y-auto px-2">
        {Object.entries(grouped).sort().map(([letter, contacts]) => (
          <div key={letter}>
            <p className="px-3 py-1.5 text-xs font-bold" style={{ color: 'var(--neon-purple)' }}>{letter}</p>
            {contacts.map((contact, i) => (
              <button
                key={contact.id}
                onClick={() => onStartChat(contact.id)}
                className="w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all mb-1 animate-fade-in"
                style={{ animationDelay: `${i * 0.05}s` }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div className="relative">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: contact.color }}>
                    {contact.avatar}
                  </div>
                  {contact.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                      style={{ background: 'var(--neon-green)', borderColor: 'hsl(225,20%,6%)', boxShadow: '0 0 6px rgba(0,245,212,0.8)' }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-white truncate">{contact.name}</p>
                  <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {contact.online ? <span style={{ color: 'var(--neon-green)' }}>онлайн</span> : contact.phone}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(0,245,212,0.08)' }}>
                    <Icon name="Phone" size={13} style={{ color: 'var(--neon-green)' }} />
                  </div>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(168,85,247,0.08)' }}>
                    <Icon name="MessageCircle" size={13} style={{ color: 'var(--neon-purple)' }} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
