import { ChatSession, Message, PersonalityType } from '@/types/chat';

const STORAGE_KEY = 'egebot_chat_sessions';

export const chatStorage = {
  // Tüm sohbetleri getir
  getSessions(): ChatSession[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const sessions = JSON.parse(stored);
      // Date objelerini yeniden oluştur
      return sessions.map((session: any) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
        messages: session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      return [];
    }
  },

  // Sohbetleri kaydet
  saveSessions(sessions: ChatSession[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving chat sessions:', error);
    }
  },

  // Yeni sohbet oluştur
  createSession(personality: PersonalityType = 'default'): ChatSession {
    const session: ChatSession = {
      id: Date.now().toString(),
      title: 'Yeni Sohbet',
      messages: [],
      personality,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const sessions = this.getSessions();
    sessions.unshift(session); // En başa ekle
    this.saveSessions(sessions);
    
    return session;
  },

  // Sohbet güncelle
  updateSession(sessionId: string, updates: Partial<ChatSession>): void {
    const sessions = this.getSessions();
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex !== -1) {
      sessions[sessionIndex] = {
        ...sessions[sessionIndex],
        ...updates,
        updatedAt: new Date()
      };
      this.saveSessions(sessions);
    }
  },

  // Mesaj ekle
  addMessage(sessionId: string, message: Message): void {
    const sessions = this.getSessions();
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex !== -1) {
      sessions[sessionIndex].messages.push(message);
      
      // İlk kullanıcı mesajından başlık oluştur
      if (sessions[sessionIndex].title === 'Yeni Sohbet' && !message.isBot) {
        sessions[sessionIndex].title = message.text.slice(0, 30) + (message.text.length > 30 ? '...' : '');
      }
      
      sessions[sessionIndex].updatedAt = new Date();
      this.saveSessions(sessions);
    }
  },

  // Sohbet sil
  deleteSession(sessionId: string): void {
    const sessions = this.getSessions();
    const filteredSessions = sessions.filter(s => s.id !== sessionId);
    this.saveSessions(filteredSessions);
  },

  // Sohbet geçmişini temizle
  clearAllSessions(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }
};