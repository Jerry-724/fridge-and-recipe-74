
import React, { useState } from 'react';
import FormContainer from './FormContainer';

interface EditNicknameProps {
  onCancel: () => void;
  onSubmit: (password: string, nickname: string) => Promise<void>;
  loading: boolean;
}

const EditNickname: React.FC<EditNicknameProps> = ({ onCancel, onSubmit, loading }) => {
  const [password, setPassword] = useState('');
  const [newNickname, setNewNickname] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password, newNickname);
  };
  
  return (
    <FormContainer>
      <form onSubmit={handleSubmit} className="space-y-3">
        <h2 className="text-lg font-medium mb-2">닉네임 변경</h2>
        
        <div className="space-y-1">
          <label className="block text-sm text-gray-700">현재 비밀번호</label>
          <input
            type="password"
            className="input-field mb-2"
            placeholder="현재 비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className="space-y-1">
          <label className="block text-sm text-gray-700">새 닉네임</label>
          <input
            type="text"
            className="input-field mb-2"
            placeholder="새 닉네임"
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className="flex space-x-4 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 border border-gray-300 rounded-md"
            disabled={loading}
          >
            취소
          </button>
          <button
            type="submit"
            className="flex-1 bg-primary text-white py-3 rounded-md"
            disabled={!password || !newNickname || loading}
          >
            {loading ? '변경 중...' : '변경하기'}
          </button>
        </div>
      </form>
    </FormContainer>
  );
};

export default EditNickname;
