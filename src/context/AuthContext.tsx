
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";

// Define User type and export it
export interface User {
  user_id: number;
  login_id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (login_id: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (login_id: string, password: string, username: string) => Promise<void>;
}

// Mock user data for development
const MOCK_USER: User = {
  user_id: 1,
  login_id: 'user123',
  username: '김냉장',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // For development/testing: uncomment to start with a logged-in user
  useEffect(() => {
    checkAuth();
  }, []);
  
  const checkAuth = async () => {
    // In a real app, check token from localStorage and validate with API
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        // Mock API call to validate token
        await new Promise(resolve => setTimeout(resolve, 300));
        setUser(MOCK_USER);
      } catch (error) {
        logout();
      }
    }
  };
  
  const login = async (login_id: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, send credentials to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (login_id === 'user123' && password === 'password123') {
        // Store token
        localStorage.setItem('auth_token', 'mock_token_123');
        setUser(MOCK_USER);
        toast("로그인에 성공했습니다");
      } else {
        throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      localStorage.removeItem('auth_token');
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };
  
  const signup = async (login_id: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      // In a real app, send registration data to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (login_id === 'user123') {
        throw new Error('이미 사용중인 아이디입니다.');
      }
      
      // In a real app, don't set the user here, just return success
      // User should log in after registration
      toast("회원가입 되었습니다");
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
