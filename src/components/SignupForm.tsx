
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SignupFormProps {
  onToggleLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onToggleLogin }) => {
  const [login_id, setLoginId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const { signup, isLoading } = useAuth();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!login_id || !password || !confirmPassword || !username) {
      toast({
        title: '오류',
        description: '모든 필드를 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: '오류',
        description: '비밀번호가 일치하지 않습니다.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await signup(login_id, password, username);
      toast({
        title: '회원가입 성공',
        description: '이제 로그인을 진행해주세요.',
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
        
        <div>
          <input
            type="password"
            className="input-field"
            placeholder="비밀번호 확인"
            value={confirmPassword}
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
          className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-md transition-colors"
          disabled={isLoading}
        >
          {isLoading ? '회원가입 중...' : '회원가입'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <button
          onClick={onToggleLogin}
          className="text-primary hover:text-primary-dark transition-colors"
          disabled={isLoading}
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default SignupForm;
