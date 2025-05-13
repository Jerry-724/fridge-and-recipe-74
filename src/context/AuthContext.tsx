
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, AuthResponse } from '../types/api';
import axios from 'axios'

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (login_id: string, password: string) => Promise<void>;
  signup: (login_id: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (login_id: string, password: string) => {
    try {
      // For demonstration, we'll simulate an API call
      // In a real app, you would call your backend API
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await axios.post('http://localhost:8000/user/login', {
        login_id,
        password
      });

      const data = response.data;

      const user = {
        user_id: data.user_id,
        login_id: data.login_id,
        username: data.username,
        notification: true,
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      setIsAuthenticated(true);
      
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (login_id: string, password: string, username: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await axios.post('http://localhost:8000/user/create', {
        login_id,
        username,
        password1: password,
        password2: password
      })

      if (response.status === 204) {
        return;
      } else {
        throw new Error('회원가입 요청이 실패했습니다.');
      }
      
    } catch (error: unknown) {
      console.error('Signup failed:', error);

      // error가 AxiosError인지 확인
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;
        if (detail) {
          throw new Error(detail);
        }
      }

      // 일반적인 에러 처리
      throw new Error('회원가입에 실패했습니다.')
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = async (updatedFields: Partial<User>) => {
    try {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, send the updated fields to your API
      // For now, just update the local state
      const updatedUser = { ...user, ...updatedFields } as User;
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
    } catch (error) {
      console.error('User update failed:', error);
      throw new Error('사용자 정보 업데이트에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async (password: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, send the delete request to your API
      // For now, just clear local storage and state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      
    } catch (error) {
      console.error('Account deletion failed:', error);
      throw new Error('계정 삭제에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        updateUser,
        deleteAccount
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
