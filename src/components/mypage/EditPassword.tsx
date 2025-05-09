
import React, { useState } from 'react';
import FormContainer from './FormContainer';

interface EditPasswordProps {
  onCancel: () => void;
  onSubmit: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<void>;
  loading: boolean;
}

const EditPassword: React.FC<EditPasswordProps> = ({ onCancel, onSubmit, loading }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(currentPassword, newPassword, confirmPassword);
  };

  return (
    <FormContainer title="비밀번호 변경">
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
          <label className="block text-sm mb-1">새 비밀번호</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">새 비밀번호 확인</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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

export default EditPassword;
