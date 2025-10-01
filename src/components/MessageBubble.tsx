import { Message } from '@/types/chat';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={`flex items-end gap-2 md:gap-3 mb-4 md:mb-6 ${message.isBot ? 'justify-start' : 'justify-end'}`}>
      {message.isBot && (
        <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
          <Bot className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-[85%] md:max-w-[75%] ${message.isBot ? 'bg-white' : ''} rounded-2xl shadow-lg`}>
        <div className={`px-3 md:px-4 py-2.5 md:py-3 rounded-2xl ${
          message.isBot 
            ? 'bg-white border border-gray-200 text-gray-800' 
            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
        }`}>
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{message.text}</p>
        </div>
        <p className={`text-xs px-3 md:px-4 py-1 ${
          message.isBot ? 'text-gray-400' : 'text-gray-500 text-right'
        }`}>
          {message.timestamp.toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>

      {!message.isBot && (
        <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
          <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
        </div>
      )}
    </div>
  );
}