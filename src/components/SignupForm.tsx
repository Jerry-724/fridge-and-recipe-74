
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

interface SignupFormProps {
  onToggleLogin: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onToggleLogin }) => {
  const [login_id, setLoginId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const { signup, isLoading } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!login_id || !password || !confirmPassword || !username) {
      toast("모든 필드를 입력해주세요.");
      return;
    }
    
    if (password !== confirmPassword) {
      toast("비밀번호가 일치하지 않습니다.");
      return;
    }
    
    try {
      await signup(login_id, password, username);
      onToggleLogin();
    } catch (error) {
      toast(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    }
  };
  
  return (
    <div className="w-full max-w-md px-6 animate-slide-down">
      <h2 className="text-2xl font-bold text-center mb-6" style={{ color: '#70B873' }}>뭐먹을냉?</h2>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="text"
            className="input-field mb-2"
            placeholder="아이디"
            value={login_id}
            onChange={(e) => setLoginId(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div>
          <input
            type="password"
            className="input-field mb-2"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div>
          <input
            type="password"
            className="input-field mb-2"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div>
          <input
            type="text"
            className="input-field mb-2"
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
  );
};

export default SignupForm;
