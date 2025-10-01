'use client';

import { useState, useCallback, useEffect } from 'react';
import { Message, PersonalityType, ChatSession } from '@/types/chat';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { Sidebar } from './Sidebar';
import { chatStorage } from '@/utils/chatStorage';
import { Menu, X } from 'lucide-react';

export function ChatContainer() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [personality, setPersonality] = useState<PersonalityType>('default');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // LocalStorage'dan sohbetleri yükle
  useEffect(() => {
    const loadedSessions = chatStorage.getSessions();
    setSessions(loadedSessions);
    
    // Eğer sohbet varsa son sohbeti seç
    if (loadedSessions.length > 0) {
      setCurrentSessionId(loadedSessions[0].id);
      setPersonality(loadedSessions[0].personality);
    }
  }, []);

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  const sendMessage = useCallback(async (text: string) => {
    let sessionId = currentSessionId;
    
    // Eğer aktif sohbet yoksa yeni sohbet oluştur
    if (!sessionId) {
      const newSession = chatStorage.createSession(personality);
      setSessions(prev => [newSession, ...prev]);
      sessionId = newSession.id;
      setCurrentSessionId(sessionId);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date(),
    };

    // Mesajı local state'e ekle
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, messages: [...session.messages, userMessage] }
        : session
    ));

    // Storage'a kaydet
    chatStorage.addMessage(sessionId, userMessage);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          personality,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message,
        isBot: true,
        timestamp: new Date(),
      };

      // Bot mesajını local state'e ekle
      setSessions(prev => prev.map(session => 
        session.id === sessionId 
          ? { ...session, messages: [...session.messages, botMessage] }
          : session
      ));

      // Storage'a kaydet
      chatStorage.addMessage(sessionId, botMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
        isBot: true,
        timestamp: new Date(),
      };

      // Hata mesajını local state'e ekle
      setSessions(prev => prev.map(session => 
        session.id === sessionId 
          ? { ...session, messages: [...session.messages, errorMessage] }
          : session
      ));

      // Storage'a kaydet
      chatStorage.addMessage(sessionId, errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [personality, currentSessionId]);

  const handleNewChat = () => {
    // Mevcut sohbeti kaydet (eğer mesaj varsa)
    if (currentSession && currentSession.messages.length > 0) {
      // Mevcut sohbet zaten otomatik olarak kaydediliyor
      console.log('Mevcut sohbet kaydedildi:', currentSession.title);
    }
    
    // Yeni sohbet oluştur
    const newSession = chatStorage.createSession(personality);
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    // Mobilde yeni sohbet oluşturulduğunda sidebar'ı kapat
    setIsSidebarOpen(false);
  };

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setPersonality(session.personality);
    }
    // Mobilde seçim yapıldığında sidebar'ı kapat
    setIsSidebarOpen(false);
  };

  const handleDeleteSession = (sessionId: string) => {
    chatStorage.deleteSession(sessionId);
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    
    // Eğer silinen sohbet aktif sohbetse, başka bir sohbet seç
    if (currentSessionId === sessionId) {
      const remainingSessions = sessions.filter(s => s.id !== sessionId);
      if (remainingSessions.length > 0) {
        setCurrentSessionId(remainingSessions[0].id);
        setPersonality(remainingSessions[0].personality);
      } else {
        setCurrentSessionId(null);
      }
    }
  };

  const handlePersonalityChange = (newPersonality: PersonalityType) => {
    setPersonality(newPersonality);
    
    // Aktif sohbetin kişiliğini güncelle
    if (currentSessionId) {
      chatStorage.updateSession(currentSessionId, { personality: newPersonality });
      setSessions(prev => prev.map(session => 
        session.id === currentSessionId 
          ? { ...session, personality: newPersonality }
          : session
      ));
    }
  };

  return (
    <div className="flex h-screen bg-white relative">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-20 p-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg shadow-lg hover:from-emerald-600 hover:to-cyan-600 transition-all duration-200"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-40 w-64 
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar
          onNewChat={handleNewChat}
          onSelectSession={handleSelectSession}
          onDeleteSession={handleDeleteSession}
          personality={personality}
          onPersonalityChange={handlePersonalityChange}
          sessions={sessions}
          currentSessionId={currentSessionId}
          onClose={() => setIsSidebarOpen(false)}
          isMobile={true}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col md:ml-0">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-gray-200 px-16 py-4">
          <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent text-center">
            EgeBot
          </h1>
        </div>

        {/* Chat Messages */}
        <ChatMessages messages={messages} isLoading={isLoading} />

        {/* Chat Input */}
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}