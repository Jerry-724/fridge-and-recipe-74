
import React, { useState, useRef, useEffect } from 'react';
import { useRecipe } from '../context/RecipeContext';
import { ArrowRight } from 'lucide-react';

const RecipeChatbot: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const { messages, isLoading, sendMessage } = useRecipe();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollbar, setShowScrollbar] = useState<boolean>(false);
  
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

  // Check if scrollbar should be shown
  useEffect(() => {
    const checkScrollOverflow = () => {
      if (scrollContainerRef.current) {
        const { scrollHeight, clientHeight } = scrollContainerRef.current;
        setShowScrollbar(scrollHeight > clientHeight);
      }
    };

    checkScrollOverflow();
    window.addEventListener('resize', checkScrollOverflow);
    
    return () => {
      window.removeEventListener('resize', checkScrollOverflow);
    };
  }, [messages]);
  
  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-[#FFFFF0]">
      {/* Chat messages */}
      <div 
        ref={scrollContainerRef}
        className={`flex-1 overflow-y-auto p-4 space-y-4 ${showScrollbar ? '' : 'scrollbar-none'}`}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.isUser
                  ? 'bg-[#70B873] text-white rounded-tr-none'
                  : 'bg-[#9ed6a0] text-gray-800 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-line">{message.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#9ed6a0] text-gray-800 rounded-lg rounded-tl-none px-4 py-2">
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
      
      {/* Input form - updated design */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border-t border-gray-200 p-3 flex items-center gap-2"
      >
        <div className="flex items-center w-full bg-gray-100 rounded-full px-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="김치찌개 레시피 알려줘"
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
