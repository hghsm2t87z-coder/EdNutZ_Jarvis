import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { House, MessageSquare, Plus, Search, PanelLeftClose, PanelLeft, Settings, Database, Sun, Moon, Monitor } from 'lucide-react';
import { ConversationList } from './ConversationList';
import { WorkspaceSwitcher } from '../WorkspaceSwitcher';
import { useAppStore } from '../../lib/store';

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const createConversation = useAppStore((s) => s.createConversation);
  const selectedModel = useAppStore((s) => s.selectedModel);
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const ThemeIcon = settings.theme === 'light' ? Sun : settings.theme === 'dark' ? Moon : Monitor;
  const nextTheme = settings.theme === 'light' ? 'dark' : settings.theme === 'dark' ? 'system' : 'light';

  const handleNewChat = () => {
    createConversation(selectedModel);
    navigate('/chat');
  };

  const navItems = [
    { path: '/', icon: House, label: 'Home' },
    { path: '/chat', icon: MessageSquare, label: 'Chat' },
    { path: '/records', icon: Database, label: 'Records' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {!sidebarOpen && (
        <button onClick={toggleSidebar} aria-label="Open menu" className="fixed top-3 left-3 z-30 p-2.5 rounded-xl cursor-pointer" style={{ color: 'var(--color-text)', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
          <PanelLeft size={19} />
        </button>
      )}
      <aside className={`flex flex-col h-full shrink-0 transition-all duration-200 overflow-hidden fixed md:relative z-30 ${sidebarOpen ? 'w-[270px]' : 'w-0'}`} style={{ background: 'var(--color-sidebar)', backdropFilter: 'blur(20px)', borderRight: sidebarOpen ? '1px solid var(--color-border)' : 'none' }}>
        <div className="flex flex-col h-full w-[270px]">
          <div className="flex items-center justify-between px-3 pt-3 pb-2">
            <button onClick={toggleSidebar} aria-label="Close menu" className="p-2 rounded-lg cursor-pointer" style={{ color: 'var(--color-text-secondary)' }}><PanelLeftClose size={18} /></button>
            <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>Jarvis</div>
            <div className="flex gap-1">
              <button onClick={() => updateSettings({ theme: nextTheme })} aria-label="Change theme" className="p-2 rounded-lg cursor-pointer" style={{ color: 'var(--color-text-secondary)' }}><ThemeIcon size={16} /></button>
              <button onClick={handleNewChat} aria-label="New chat" className="p-2 rounded-lg cursor-pointer" style={{ color: 'var(--color-text-secondary)' }}><Plus size={18} /></button>
            </div>
          </div>

          <WorkspaceSwitcher />

          <nav className="grid grid-cols-4 gap-1 px-3 pb-3">
            {navItems.map((item) => {
              const active = location.pathname === item.path || (item.path === '/' && location.pathname === '/workspace');
              return (
                <button key={item.path} onClick={() => navigate(item.path)} className="flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] cursor-pointer" style={{ background: active ? 'var(--color-accent-subtle)' : 'transparent', color: active ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}>
                  <item.icon size={16} /><span className="truncate w-full">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="px-3 mb-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
              <Search size={14} style={{ color: 'var(--color-text-tertiary)' }} />
              <input type="text" placeholder="Search chats" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 min-w-0 bg-transparent outline-none text-sm" style={{ color: 'var(--color-text)' }} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2"><ConversationList searchQuery={searchQuery} /></div>
          <div className="px-3 py-3 text-[10px] text-center" style={{ color: 'var(--color-text-tertiary)', borderTop: '1px solid var(--color-border)' }}>Personal · Business · Work</div>
        </div>
      </aside>
    </>
  );
}
