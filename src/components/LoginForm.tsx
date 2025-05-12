
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onToggleSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleSignup }) => {
  const [login_id, setLoginId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!login_id || !password) {
      toast({
        title: '오류',
        description: '모든 필드를 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await login(login_id, password);
    } catch (error) {
      toast({
        title: '로그인 실패',
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="w-full max-w-md px-6 animate-slide-down">
      <h2 className="text-2xl font-medium text-center text-gray-800 mb-8">뭐먹을냉?</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            className="input-field"
            placeholder="아이디"
            value={login_id}
            onChange={(e) => setLoginId(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div>
          <input
            type="password"
            className="input-field"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-md transition-colors"
          disabled={isLoading}
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <button
          onClick={onToggleSignup}
          className="text-primary hover:text-primary-dark transition-colors"
          disabled={isLoading}
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
