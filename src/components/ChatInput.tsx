import { Send, Loader2, Paperclip, Mic } from 'lucide-react';
import { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative bg-white border border-gray-300 rounded-3xl shadow-lg focus-within:shadow-xl focus-within:border-blue-300 transition-all duration-200">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Mesajınızı yazın..."
              disabled={isLoading}
              className="w-full px-4 py-3 pr-20 bg-transparent text-gray-900 placeholder-gray-500
                       focus:outline-none resize-none max-h-32 min-h-[50px] rounded-3xl"
              rows={1}
              style={{
                height: 'auto',
                minHeight: '50px',
                maxHeight: '128px'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 128) + 'px';
              }}
            />
            
            {/* Input Actions */}
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 opacity-70 hover:opacity-100"
                title="Dosya Ekle"
              >
                <Paperclip className="w-4 h-4 text-gray-500" />
              </button>
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 opacity-70 hover:opacity-100"
                title="Sesli Mesaj"
              >
                <Mic className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          
          <button
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                     transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105
                     ${message.trim() && !isLoading
                       ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                       : 'bg-gray-300 cursor-not-allowed'
                     }`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
          <span>Enter ile gönder</span>
          <span>•</span>
          <span>Shift + Enter ile yeni satır</span>
        </div>
      </div>
    </div>
  );
}