
import React, { createContext, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from "./AuthContext";

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

// API 기본 설정
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 백엔드 서버 URL로 변경 필요
  headers: {
    "ngrok-skip-browser-warning": "true",
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 요청 인터셉터 - 모든 요청에 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.user_id;
  
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: '안녕하세요! 오늘은 어떤 요리를 도와드릴까요?', isUser: false }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user_id } = useParams<{ user_id: string }>();
  
  const sendMessage = async (messageText: string) => {

    console.log("🔍 user_request:", messageText);
    console.log(userId)

    if (!userId) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "로그인이 필요합니다. 먼저 로그인해주세요.",
        isUser: false,
      }]);
      return;
    }
    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage: Message = {
        id: messages.length + 1,
        text: messageText,
        isUser: true,
      };
      
      setMessages(prev => [...prev, userMessage]);
      
   
      
      // 백엔드 API 호출
      const response = await api.get(`/qa/recommend-recipes`, {
        params: { user_request: messageText }
      });
      
      // 봇 응답 메시지 추가
      const botMessage: Message = {
        id: Date.now() + 1,
        text: response.data.result,
        isUser: false,
      };
      
      setMessages(prev => [...prev, botMessage]);
      
    } catch (error) {
      console.error('Error sending message:', error);

      // 오류 메시지 추가
      let errorMessage = '죄송합니다. 요청을 처리하는 중 오류가 발생했습니다.';
      
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        errorMessage = '로그인이 필요하거나 세션이 만료되었습니다. 다시 로그인해주세요.';
      }
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: errorMessage,
        isUser: false,
      }]);
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
