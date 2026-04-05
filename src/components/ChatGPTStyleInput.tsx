import { Mic, Paperclip } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Card } from './ui/Card';

interface ChatGPTStyleInputProps {
  message: string;
  citation: {
    text: string;
    url: string;
  };
}

export const ChatGPTStyleInput = ({ message, citation }: ChatGPTStyleInputProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= message.length) {
        setDisplayedText(message.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTypingComplete(true);
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [message]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <Card className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] shadow-lg overflow-hidden max-w-2xl fade-in">
      {/* ChatGPT-style header */}
      <div className="bg-[var(--color-muted)]/50 px-4 py-3 border-b border-[var(--color-border)]">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>

      {/* Main content area with input field */}
      <div className="p-6 min-h-[300px] flex flex-col justify-center">

        {/* Input container - mimics ChatGPT's input field */}
        <div className="relative">
          <div className="bg-[var(--color-background)] border-2 border-[var(--color-border)] rounded-2xl px-4 py-4 min-h-[120px] flex flex-col justify-between transition-all duration-200 hover:border-[var(--color-primary)]/50">

            {/* Text area with typing animation */}
            <div className="flex-1 min-h-[60px] flex items-start">
              <span className="text-[var(--color-foreground)] text-lg leading-relaxed font-medium break-words">
                {displayedText}
                {!isTypingComplete && (
                  <span className={`inline-block w-0.5 h-6 bg-[var(--color-foreground)] ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}></span>
                )}
              </span>
            </div>

            {/* Input controls */}
            <div className="flex items-center justify-between mt-2">
              <button className="p-2 hover:bg-[var(--color-muted)] rounded-lg transition-colors">
                <Paperclip className="h-4 w-4 text-[var(--color-foreground)]/60" />
              </button>

              <button
                className={`p-2 rounded-lg transition-all duration-200 ${isTypingComplete
                  ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80 text-[var(--color-primary-foreground)]'
                  : 'bg-[var(--color-muted)] text-[var(--color-foreground)]/40'
                  }`}
                title={isTypingComplete ? 'Start voice input' : 'Stop voice input'}
              >
                <Mic className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Character counter and citation */}
          <div className="flex items-center justify-between mt-2 px-2">
            <div className="text-xs text-[var(--color-foreground)]/50">
              {displayedText.length} / {message.length}
            </div>
            {isTypingComplete && (
              <cite className="text-xs text-[var(--color-foreground)]/60">
                <Link
                  href={citation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-[var(--color-primary)]"
                >
                  Source: {citation.text}
                </Link>
              </cite>
            )}
          </div>
        </div>

        {/* Bottom hint text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-[var(--color-foreground)]/50">
            ChatGPT can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </Card>
  );
};