
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from '@/hooks/use-toast';

interface LoginFormProps {
  onToggleSignup: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleSignup }) => {
  const [login_id, setLoginId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login, isLoading } = useAuth();
  
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
      toast({
        title: '로그인에 성공했습니다',
        duration: 1000,
      });
    } catch (error) {
      toast({
        title: '로그인 실패',
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    // ✅ 가운데 정렬을 위한 flex, min-h-screen, justify-center, items-center 추가
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md px-6 animate-slide-down">
        <h2 className="text-2xl font-bold text-center text-[#70B873] mb-6">뭐먹을냉?</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
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
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-md transition-colors mt-2"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={onToggleSignup}
            className="text-primary hover:text-primary-dark transition-colors"
            disabled={isLoading}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
