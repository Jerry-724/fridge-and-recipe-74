
import React, { createContext, useState, useContext } from 'react';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

interface RecipeContextType {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: '안녕하세요! 오늘은 어떤 요리를 도와드릴까요?', isUser: false }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const sendMessage = async (messageText: string) => {
    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage: Message = {
        id: messages.length + 1,
        text: messageText,
        isUser: true,
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock responses based on keywords
      let responseText = '죄송합니다. 지금은 답변할 수 없습니다.';
      
      if (messageText.includes('추천')) {
        responseText = '냉장고 속 재료로 만들 수 있는 요리는 다음과 같습니다:\n\n1. 소고기 버섯 볶음\n2. 당근 사과 샐러드\n3. 우유 푸딩';
      } else if (messageText.includes('레시피') || messageText.includes('만드는 법')) {
        responseText = '소고기 버섯 볶음 레시피:\n\n재료: 소고기 100g, 버섯 50g, 간장 1큰술, 설탕 1작은술\n\n1. 소고기는 얇게 썰어 간장과 설탕에 재워둡니다.\n2. 버섯은 적당한 크기로 썹니다.\n3. 팬에 기름을 두르고 소고기를 볶다가 버섯을 넣고 함께 볶아줍니다.\n4. 간이 부족하면 소금을 약간 더해줍니다.';
      } else if (messageText.includes('안녕') || messageText.includes('뭐해')) {
        responseText = '안녕하세요! 오늘 뭐 드실지 고민이시라면 냉장고 속 재료를 알려주세요.';
      } else if (messageText.includes('저녁')) {
        responseText = '오늘 저녁으로는 소고기 볶음이 어떨까요? 당근과 함께 볶으면 영양가도 높아집니다.';
      }
      
      const botMessage: Message = {
        id: messages.length + 2,
        text: responseText,
        isUser: false,
      };
      
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearMessages = () => {
    setMessages([
      { id: 1, text: '안녕하세요! 오늘은 어떤 요리를 도와드릴까요?', isUser: false }
    ]);
  };
  
  return (
    <RecipeContext.Provider
      value={{
        messages,
        isLoading,
        sendMessage,
        clearMessages,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipe = (): RecipeContextType => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipe must be used within a RecipeProvider');
  }
  return context;
};
