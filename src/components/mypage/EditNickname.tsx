
import React, { useState } from 'react';
import FormContainer from './FormContainer';

interface EditNicknameProps {
  onCancel: () => void;
  onSubmit: (currentPassword: string, newNickname: string) => Promise<void>;
  loading: boolean;
}

const EditNickname: React.FC<EditNicknameProps> = ({ onCancel, onSubmit, loading }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newNickname, setNewNickname] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(currentPassword, newNickname);
  };

  return (
    <FormContainer title="닉네임 변경">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">현재 비밀번호</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">새 닉네임</label>
          <input
            type="text"
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="flex space-x-2 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 border rounded"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary text-white py-2 rounded"
          >
            {loading ? '처리 중...' : '변경'}
          </button>
        </div>
      </form>
    </FormContainer>
  );
};

export default EditNickname;
