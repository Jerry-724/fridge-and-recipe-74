
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from '@/hooks/use-toast';

interface SignupFormProps {
  onToggleLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onToggleLogin }) => {
  const [login_id, setLoginId] = useState<string>('');
  const [password1, setPassword] = useState<string>('');
  const [password2, setConfirmPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const { signup, isLoading } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signup(login_id, password1, password2, username);
      toast({
        title: '회원가입 되었습니다',
        duration: 1000,
      });
      onToggleLogin();
    } catch (error) {
      toast({
        title: '회원가입 실패',
        description: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    // ✅ flex, justify-center, items-center, min-h-screen 추가
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md mx-auto px-6 animate-slide-down">
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
              value={password1}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <input
              type="password"
              className="input-field"
              placeholder="비밀번호 확인"
              value={password2}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <input
              type="text"
              className="input-field"
              placeholder="닉네임"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-md transition-colors mt-2"
            disabled={isLoading}
          >
            {isLoading ? '회원가입 중...' : '회원가입'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={onToggleLogin}
            className="text-primary hover:text-primary-dark transition-colors"
            disabled={isLoading}
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
