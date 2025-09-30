'use client';

import { useState, useCallback, useEffect } from 'react';
import { Message, PersonalityType, ChatSession } from '@/types/chat';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { Sidebar } from './Sidebar';
import { chatStorage } from '@/utils/chatStorage';

export function ChatContainer() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [personality, setPersonality] = useState<PersonalityType>('default');

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
    const newSession = chatStorage.createSession(personality);
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setPersonality(session.personality);
    }
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
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        personality={personality}
        onPersonalityChange={handlePersonalityChange}
        sessions={sessions}
        currentSessionId={currentSessionId}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Messages */}
        <ChatMessages messages={messages} isLoading={isLoading} />

        {/* Chat Input */}
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}