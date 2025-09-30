export interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  personality: PersonalityType;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  isLoading: boolean;
}

export type PersonalityType = 'default' | 'friendly' | 'professional' | 'creative' | 'humorous';