
import React, { useState, useRef, useEffect } from 'react';
import { useRecipe } from '../context/RecipeContext';
import { ArrowRight } from 'lucide-react';

const RecipeChatbot: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const { messages, isLoading, sendMessage } = useRecipe();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    sendMessage(inputValue);
    setInputValue('');
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="flex flex-col h-full pb-16">
      {/* Chat messages with hidden scrollbar by default */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.isUser
                  ? 'bg-primary text-white rounded-tr-none'
                  : 'bg-[#A0D8A2] bg-opacity-30 text-gray-800 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-line">{message.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#A0D8A2] bg-opacity-30 text-gray-800 rounded-lg rounded-tl-none px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input form with updated design */}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-3 flex items-center gap-2"
      >
        <div className="flex items-center w-full bg-gray-100 rounded-full px-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="오늘 뭐 먹지?"
            className="flex-1 bg-transparent py-2 border-none focus:outline-none focus:ring-0"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="bg-[#70B873] text-white p-3 rounded-full disabled:bg-gray-400"
          disabled={isLoading || !inputValue.trim()}
        >
          <ArrowRight size={18} />
        </button>
      </form>
    </div>
  );
};

export default RecipeChatbot;
