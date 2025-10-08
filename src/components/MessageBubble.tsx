import { Message } from '@/types/chat';
import { Bot, User, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className={`flex items-end gap-2 md:gap-3 mb-4 md:mb-6 group ${message.isBot ? 'justify-start' : 'justify-end'}`}>
      {message.isBot && (
        <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
          <Bot className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-[85%] md:max-w-[75%] relative ${message.isBot ? 'bg-white' : ''} rounded-2xl shadow-lg`}>
        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="absolute -top-2 -right-2 md:top-2 md:right-2 p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
          title="Kopyala"
        >
          {copied ? (
            <Check className="w-3 h-3 text-green-600" />
          ) : (
            <Copy className="w-3 h-3 text-gray-600" />
          )}
        </button>

        <div className={`px-3 md:px-4 py-2.5 md:py-3 rounded-2xl ${
          message.isBot 
            ? 'bg-white border border-gray-200 text-gray-800' 
            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
        }`}>
          {message.isBot ? (
            <div className="text-sm md:text-base">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus as any}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg my-2"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                        {children}
                      </code>
                    );
                  },
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                  h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-bold mb-2">{children}</h3>,
                }}
              >
                {message.text}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{message.text}</p>
          )}
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