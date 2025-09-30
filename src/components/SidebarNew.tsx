'use client';

import { MessageSquare, Plus, Settings, Trash2, Bot, Palette, User, Heart, Briefcase, Smile } from 'lucide-react';
import { PersonalityType, ChatSession } from '@/types/chat';
import { useState } from 'react';

interface SidebarProps {
  onNewChat: () => void;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  personality: PersonalityType;
  onPersonalityChange: (personality: PersonalityType) => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
}

const personalities = [
  { id: 'default' as PersonalityType, name: 'Varsayılan', icon: Bot, color: 'from-indigo-500 to-purple-600' },
  { id: 'friendly' as PersonalityType, name: 'Arkadaş Canlısı', icon: Heart, color: 'from-pink-500 to-rose-500' },
  { id: 'professional' as PersonalityType, name: 'Profesyonel', icon: Briefcase, color: 'from-blue-600 to-cyan-600' },
  { id: 'creative' as PersonalityType, name: 'Yaratıcı', icon: Palette, color: 'from-purple-500 to-pink-500' },
  { id: 'humorous' as PersonalityType, name: 'Esprili', icon: Smile, color: 'from-yellow-500 to-orange-500' },
];

export function Sidebar({ onNewChat, onSelectSession, onDeleteSession, personality, onPersonalityChange, sessions, currentSessionId }: SidebarProps) {
  const [hoveredSession, setHoveredSession] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Bugün';
    if (days === 1) return 'Dün';
    if (days < 7) return `${days} gün önce`;
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="w-64 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            EgeBot
          </h1>
        </div>
        
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 transition-all duration-200 font-medium shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Yeni Sohbet
        </button>
      </div>

      {/* Chat Sessions */}
      <div className="flex-1 overflow-y-auto">
        {sessions.length > 0 && (
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-sm font-medium text-gray-300 mb-3">
              Geçmiş Sohbetler
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {sessions.slice(0, 10).map((session) => (
                <div
                  key={session.id}
                  className={`relative group rounded-lg transition-all duration-200 ${
                    currentSessionId === session.id
                      ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30'
                      : 'hover:bg-gray-700/50'
                  }`}
                  onMouseEnter={() => setHoveredSession(session.id)}
                  onMouseLeave={() => setHoveredSession(null)}
                >
                  <button
                    onClick={() => onSelectSession(session.id)}
                    className="w-full text-left px-3 py-2 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-200 truncate">
                          {session.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(session.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </button>
                  
                  {hoveredSession === session.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personality Selector */}
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Bot Kişiliği
          </h3>
          <div className="space-y-2">
            {personalities.map((pers) => {
              const Icon = pers.icon;
              const isSelected = personality === pers.id;
              
              return (
                <button
                  key={pers.id}
                  onClick={() => onPersonalityChange(pers.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isSelected
                      ? `bg-gradient-to-r ${pers.color} text-white shadow-lg scale-105`
                      : 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-white/20' : 'bg-gray-600'
                  }`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className="text-sm font-medium">{pers.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-800/50">
          <div className="w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-200">Kullanıcı</p>
            <p className="text-xs text-gray-400">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
}