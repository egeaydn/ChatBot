'use client';

import { MessageSquare, Plus, Settings, Trash2, Bot, Palette, User, Heart, Briefcase, Smile, MoreHorizontal } from 'lucide-react';
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

      {/* Chat History */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Sohbet Geçmişi
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Henüz sohbet yok</p>
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = currentSessionId === session.id;
              const personalityInfo = personalities.find(p => p.id === session.personality);
              const Icon = personalityInfo?.icon || Bot;
              
              return (
                <div
                  key={session.id}
                  className={`relative group ${isActive ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30' : 'hover:bg-gray-700/30'} rounded-lg transition-all duration-200`}
                  onMouseEnter={() => setHoveredSession(session.id)}
                  onMouseLeave={() => setHoveredSession(null)}
                >
                  <button
                    onClick={() => onSelectSession(session.id)}
                    className="w-full p-3 text-left flex items-start gap-3"
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive 
                        ? `bg-gradient-to-r ${personalityInfo?.color} shadow-lg` 
                        : 'bg-gray-600'
                    }`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium truncate ${
                        isActive ? 'text-white' : 'text-gray-200'
                      }`}>
                        {session.title}
                      </h4>
                      <p className={`text-xs truncate mt-1 ${
                        isActive ? 'text-emerald-200' : 'text-gray-400'
                      }`}>
                        {session.messages.length > 0 
                          ? session.messages[session.messages.length - 1].text 
                          : 'Yeni sohbet'
                        }
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(session.updatedAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </button>
                  
                  {/* Delete Button */}
                  {(hoveredSession === session.id || isActive) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className="absolute top-2 right-2 p-1 rounded bg-red-500/80 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

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