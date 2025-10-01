import { Message } from '@/types/chat';
import { MessageBubble } from './MessageBubble';
import { useEffect, useRef } from 'react';
import { Bot, Sparkles } from 'lucide-react';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="relative mb-4 md:mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
              <Bot className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <div className="absolute -top-1 md:-top-2 -right-1 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent mb-2 md:mb-3">
            EgeBot'a Hoş Geldiniz! 👋
          </h2>
          
          <p className="text-gray-600 leading-relaxed mb-4 md:mb-6 text-sm md:text-base">
            Merhaba! Ben EgeBot, sizinle sohbet etmek için buradayım. 
            Bana herhangi bir konuda soru sorabilir veya sohbet edebilirsiniz.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-3 border border-blue-100">
              <div className="text-blue-600 font-medium mb-1">🤖 Akıllı Asistan</div>
              <div className="text-gray-600">Sorularınızı yanıtlıyorum</div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100">
              <div className="text-purple-600 font-medium mb-1">🎭 Çoklu Kişilik</div>
              <div className="text-gray-600">5 farklı karakter</div>
            </div>
          </div>
          
          <div className="mt-4 md:mt-6 text-xs md:text-sm text-gray-500">
            <p className="hidden md:block">💡 Soldaki panelden kişiliğimi değiştirebilirsiniz</p>
            <p className="md:hidden">💡 Sol üstteki menüden kişiliğimi değiştirebilirsiniz</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto px-3 md:px-4 py-4 md:py-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="flex items-end gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
              <Bot className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-3 md:px-4 py-2.5 md:py-3 shadow-lg">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}