import { useState } from 'react';
import AuthScreen from '@/components/AuthScreen';
import ChatList from '@/components/messenger/ChatList';
import ChatWindow from '@/components/messenger/ChatWindow';
import CallScreen from '@/components/messenger/CallScreen';
import ContactsPanel from '@/components/messenger/ContactsPanel';
import ProfileSettings from '@/components/messenger/ProfileSettings';
import Icon from '@/components/ui/icon';
import { DEMO_CHATS, type Chat } from '@/components/messenger/data';

type Panel = 'none' | 'contacts' | 'profile';
type CallState = { chat: Chat; type: 'voice' | 'video' } | null;

export default function Index() {
  const [user, setUser] = useState<{ name: string; phone: string; avatar: string } | null>(null);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [panel, setPanel] = useState<Panel>('none');
  const [call, setCall] = useState<CallState>(null);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  if (!user) {
    return <AuthScreen onAuth={u => setUser(u)} />;
  }

  const handleSelectChat = (chat: Chat) => {
    setActiveChat(chat);
    setPanel('none');
    setMobileChatOpen(true);
  };

  const handleStartChat = (contactId: number) => {
    const chat = DEMO_CHATS.find(c => c.id === contactId);
    if (chat) { handleSelectChat(chat); }
    setPanel('none');
  };

  const handleCall = (type: 'voice' | 'video', chat: Chat) => {
    setCall({ chat, type });
  };

  const rightContent = () => {
    if (panel === 'contacts') {
      return <ContactsPanel onClose={() => setPanel('none')} onStartChat={handleStartChat} />;
    }
    if (panel === 'profile') {
      return <ProfileSettings user={user} onClose={() => setPanel('none')} onLogout={() => setUser(null)} />;
    }
    if (activeChat) {
      return <ChatWindow chat={activeChat} onCall={handleCall} />;
    }
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8">
        <div className="w-20 h-20 rounded-3xl mb-6 flex items-center justify-center animate-float"
          style={{ background: 'linear-gradient(135deg, #a855f7, #06d6f5)', boxShadow: '0 0 40px rgba(168,85,247,0.4)' }}>
          <Icon name="Zap" size={36} className="text-white" />
        </div>
        <h2 className="text-2xl font-black gradient-text mb-2">Pulse</h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>Выберите чат для начала общения</p>
      </div>
    );
  };

  return (
    <div className="h-screen mesh-bg font-golos flex overflow-hidden">
      {/* Sidebar nav */}
      <div className="w-16 flex flex-col items-center py-4 gap-3 flex-shrink-0"
        style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="w-10 h-10 rounded-2xl mb-2 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #a855f7, #06d6f5)', boxShadow: '0 0 16px rgba(168,85,247,0.4)' }}>
          <Icon name="Zap" size={18} className="text-white" />
        </div>

        {[
          { icon: 'MessageCircle', id: 'none', label: 'Чаты' },
          { icon: 'Users', id: 'contacts', label: 'Контакты' },
        ].map(item => (
          <button key={item.id} onClick={() => setPanel(panel === (item.id as Panel) ? 'none' : (item.id as Panel))}
            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-200"
            style={{
              background: panel === item.id ? 'rgba(168,85,247,0.2)' : 'transparent',
              border: panel === item.id ? '1px solid rgba(168,85,247,0.35)' : '1px solid transparent',
            }}
            title={item.label}>
            <Icon name={item.icon} size={18}
              style={{ color: panel === item.id ? 'var(--neon-purple)' : 'rgba(255,255,255,0.4)' }} />
          </button>
        ))}

        <div className="flex-1" />

        <button onClick={() => setPanel(panel === 'profile' ? 'none' : 'profile')}
          className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white text-xs transition-all"
          style={{
            background: 'linear-gradient(135deg, #a855f7, #06d6f5)',
            boxShadow: panel === 'profile' ? '0 0 16px rgba(168,85,247,0.6)' : 'none',
          }}>
          {user.avatar}
        </button>
      </div>

      {/* Chat list */}
      <div className={`w-80 flex-shrink-0 ${mobileChatOpen ? 'hidden md:flex' : 'flex'} flex-col`}>
        <ChatList
          activeChat={activeChat}
          onSelectChat={handleSelectChat}
          currentUser={user}
          onOpenContacts={() => setPanel(panel === 'contacts' ? 'none' : 'contacts')}
        />
      </div>

      {/* Main content */}
      <div className={`flex-1 min-w-0 ${!mobileChatOpen && !activeChat ? 'hidden md:flex' : 'flex'} flex-col relative`}>
        {mobileChatOpen && (
          <button
            onClick={() => { setMobileChatOpen(false); setActiveChat(null); }}
            className="md:hidden absolute top-4 left-4 z-10 w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.08)' }}>
            <Icon name="ArrowLeft" size={16} style={{ color: 'rgba(255,255,255,0.7)' }} />
          </button>
        )}
        {rightContent()}
      </div>

      {/* Call overlay */}
      {call && (
        <CallScreen chat={call.chat} type={call.type} onEnd={() => setCall(null)} />
      )}
    </div>
  );
}
