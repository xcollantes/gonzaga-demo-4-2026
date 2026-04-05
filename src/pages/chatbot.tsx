/**
 * Chatbot Page Component
 *
 * This page provides an interface for interacting with an AI chatbot.
 * It includes:
 * - Chat session management (create, load, switch between sessions)
 * - Message history persistence via backend API
 * - Real-time message updates
 * - Integration with backend API for all chatbot functionality
 * - Session management (create, delete, archive)
 *
 * The page is wrapped with DashboardLayout for consistent navigation.
 */

import DashboardLayout from '@/components/DashboardLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { chatSessionMessagesApiUrl, chatSessionsApiUrl, createChatSessionApiUrl } from '@/lib/api-urls';
import { toastError, toastSuccess } from '@/lib/toast';
import { ChatMessage, ChatSession } from '@/schemas/chatbot';
import { MessageSquare } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export default function ChatBot() {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingSessions] = useState<boolean>(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const getAuthHeaders = useCallback(async () => {
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const token = await currentUser.getIdToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }, [currentUser]);

  // const loadChatSessions = async () => {
  //   if (!currentUser) return;

  //   setIsLoadingSessions(true);
  //   try {
  //     const headers = await getAuthHeaders();
  //     const response = await fetch(chatSessionsApiUrl, {
  //       headers,
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     setSessions(data.result.sessions || []);

  //     // Auto-select the most recent active session
  //     const activeSessions = data.result.sessions.filter((s: ChatSession) => s.status === 'active');
  //     if (activeSessions.length > 0 && !currentSession) {
  //       await loadSession(activeSessions[0].sessionId);
  //     }
  //   } catch (error) {
  //     console.error('Error loading chat sessions:', error);
  //     toastError('Failed to load chat sessions');
  //   } finally {
  //     setIsLoadingSessions(false);
  //   }
  // };

  const createNewSession = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(createChatSessionApiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: `Chat Session - ${new Date().toLocaleString()}`,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newSession = data.result.session;

      setSessions(prev => [newSession, ...prev]);
      setCurrentSession(newSession);
      setMessages([]);
    } catch (error) {
      console.error('Error creating new session:', error);
      toastError('Failed to create new session');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSession = async (sessionId: string) => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${chatSessionsApiUrl}/${sessionId}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCurrentSession(data.result.session);
      setMessages(data.result.messages || []);
    } catch (error) {
      console.error('Error loading session:', error);
      toastError('Failed to load session');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSession = async (sessionId: string) => {
    if (!currentUser) return;

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(chatSessionMessagesApiUrl(sessionId), {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSessions(prev => prev.filter(s => s.sessionId !== sessionId));

      if (currentSession?.sessionId === sessionId) {
        setCurrentSession(null);
        setMessages([]);
      }

      toastSuccess('Session deleted');
    } catch (error) {
      console.error('Error deleting session:', error);
      toastError('Failed to delete session');
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) {
      toastError('Please enter a message');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    const messageContent = inputMessage;
    setInputMessage('');

    try {
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Create new session if none exists
      if (!currentSession) {
        await createNewSession();
        if (!currentSession) {
          throw new Error('Failed to create session');
        }
      }

      const headers = await getAuthHeaders();
      const response = await fetch(chatSessionMessagesApiUrl(currentSession.sessionId), {
        method: 'POST',
        headers,
        body: JSON.stringify({
          content: messageContent,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error sending message! status: ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Update messages with user message and bot response
      const newMessages = [data.result.userMessage];
      if (data.result.botMessage) {
        newMessages.push(data.result.botMessage);
      }

      setMessages(prev => [...prev, ...newMessages]);
      console.log('Message sent successfully', data);
    } catch (error) {
      console.error('Error sending message:', error);
      toastError('Failed to send message');

      // Add error message to chat
      const errorMessage: ChatMessage = {
        messageId: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="py-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">
                AI Chatbot
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Session Management Sidebar */}
              <div className="lg:col-span-1">
                <Card className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-[var(--color-foreground)] flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Chat sessions
                    </h3>
                    <Button
                      onClick={createNewSession}
                      size="sm"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </Button>
                  </div>

                  {isLoadingSessions ? (
                    <div className="flex justify-center py-4">
                      <LoadingSpinner size="sm" fullPage={false} />
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {sessions.map((session) => (
                        <div
                          key={session.sessionId}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${currentSession?.sessionId === session.sessionId
                            ? 'bg-[var(--color-accent)] border-[var(--color-accent-foreground)]'
                            : 'bg-[var(--color-muted)] border-[var(--color-border)] hover:bg-[var(--color-muted)]/80'
                            }`}
                          onClick={() => loadSession(session.sessionId)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[var(--color-foreground)] truncate">
                                {session.title}
                              </p>
                              <p className="text-xs text-[var(--color-muted-foreground)]">
                                {session.messageCount} messages
                              </p>
                              <p className="text-xs text-[var(--color-muted-foreground)]">
                                {formatTime(session.updatedAt)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSession(session.sessionId);
                              }}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      ))}
                      {sessions.length === 0 && (
                        <p className="text-sm text-[var(--color-muted-foreground)] text-center py-4">
                          No sessions yet
                        </p>
                      )}
                    </div>
                  )}
                </Card>
              </div>

              {/* Chat Interface */}
              <div className="lg:col-span-3">

                {/* Chat Messages */}
                <Card className="h-[600px] flex flex-col">
                  {/* Messages Area */}
                  <div className="flex-1 overflow-hidden">
                    <div className="h-full p-4 overflow-y-auto" ref={scrollAreaRef}>
                      {messages.length === 0 ? (
                        <div className="text-center py-10">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message.messageId}
                              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender === 'user'
                                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                  : 'bg-[var(--color-muted)] text-[var(--color-foreground)]'
                                  }`}
                              >
                                <p className="text-sm">{message.content}</p>
                                <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-[var(--color-muted-foreground)]'
                                  }`}>
                                  {formatTime(message.timestamp)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-[var(--color-muted)]">
                            <div className="flex items-center space-x-2">
                              <LoadingSpinner size="sm" fullPage={false} />
                              <span className="text-[var(--color-muted-foreground)] text-sm">
                                Thinking...
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="border-t border-[var(--color-border)] p-4">
                    <div className="flex space-x-2">
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask a question..."
                        className="flex-1"
                        disabled={isLoading}
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={isLoading || !inputMessage.trim()}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        {isLoading ? (
                          <LoadingSpinner size="sm" fullPage={false} />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}