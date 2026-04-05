export interface ChatMessage {
  messageId: string;
  content: string;
  sender: 'user' | 'bot' | 'system';
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface ChatSession {
  sessionId: string;
  title: string;
  status: 'active' | 'ended' | 'archived';
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  webhookUrl?: string;
  metadata?: Record<string, unknown>;
}