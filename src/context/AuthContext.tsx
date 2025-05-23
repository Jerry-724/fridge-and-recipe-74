// src/context/AuthContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import axios, { AxiosInstance } from 'axios';
import { User } from '../types/api';
import { toast } from '@/hooks/use-toast'; // 또는 사용하는 토스트 라이브러리 import

interface AuthContextType {
  apiClient: AxiosInstance;
  user: User | null;
  user_id: number | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (login_id: string, password: string) => Promise<void>;
  signup: (login_id: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 1) Axios 인스턴스 생성 및 토큰 자동 헤더 삽입
  const apiClient = useMemo(() => {
// HEAD
    const client = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
    });
    client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        (config.headers as Record<string,string>)['Authorization'] = `Bearer ${token}`;
        // ngrok 경고 우회 헤더 추가
        (config.headers as Record<string, string>)['ngrok-skip-browser-warning'] = 'true';
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  return client;
}, [token]);


  // 2) 초기 로컬스토리지에서 토큰·유저 로드
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (login_id: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/user/login', {
        login_id,
        password,
      });
      const data = response.data as {
        access_token: string;
        user_id: number;
        login_id: string;
        username: string;
        notification: boolean;
      };
      const userObj: User = {
        user_id: data.user_id,
        login_id: data.login_id,
        username: data.username,
        notification: data.notification,
      };

      // 토큰·유저 상태 저장
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(userObj));
      setToken(data.access_token);
      setUser(userObj);
      setIsAuthenticated(true);
    } catch (error) {
      const detail = error.response?.data?.detail;
      toast(detail)
      throw new Error(detail || '로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (login_id: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/user/create', {
        login_id,
        username,
        password1: password,
        password2: password,
      });
      if (response.status !== 204) {
        throw new Error('회원가입 요청이 실패했습니다.');
      }
    } catch (error: any) {
      console.error('Signup failed:', error);
      const detail = error.response?.data?.detail;
      let message = '';

      if (Array.isArray(detail)) {
        message = detail[0]?.msg || '입력값을 확인해주세요.';
      } else if (typeof detail === 'string') {
        // 커스텀 에러 메시지
        message = detail;
      } else {
        message = '알 수 없는 오류가 발생했습니다.';
      }

      toast({
        title: '회원가입 실패',
        description: message,
        variant: 'destructive', // 에러 스타일
      });
      throw new Error(message || '회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('fcm_token');
    setToken(null);
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
    setIsLoading(true);
    try {
      if (!user) throw new Error('사용자 정보가 없습니다.');
      await apiClient.delete(`/user/${user.user_id}/delete`, {
        data: { password },
      });
      logout();
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
        apiClient,
        user,
        user_id: user?.user_id ?? null,
        token,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        updateUser,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};