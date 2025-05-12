
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(currentPassword, newPassword, confirmPassword);
  };
  
  return (
    <FormContainer>
      <form onSubmit={handleSubmit} className="space-y-3">
        <h2 className="text-base font-medium mb-2">비밀번호 변경</h2>
        
        <div className="space-y-1">
          <label className="block text-sm text-gray-700">현재 비밀번호</label>
          <input
            type="password"
            className="input-field mb-2"
            placeholder="현재 비밀번호"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className="space-y-1">
          <label className="block text-sm text-gray-700">새 비밀번호</label>
          <input
            type="password"
            className="input-field mb-2"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className="space-y-1">
          <label className="block text-sm text-gray-700">새 비밀번호 확인</label>
          <input
            type="password"
            className="input-field mb-2"
            placeholder="새 비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            disabled={!currentPassword || !newPassword || !confirmPassword || loading}
          >
            {loading ? '변경 중...' : '변경하기'}
          </button>
        </div>
      </form>
    </FormContainer>
  );
};

export default EditPassword;
