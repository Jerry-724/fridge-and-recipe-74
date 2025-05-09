
import React, { useState } from 'react';
import FormContainer from './FormContainer';

interface DeleteAccountProps {
  onCancel: () => void;
  onDelete: (password: string) => Promise<void>;
  loading: boolean;
}

const DeleteAccount: React.FC<DeleteAccountProps> = ({ onCancel, onDelete, loading }) => {
  const [password, setPassword] = useState('');

  const handleDelete = () => {
    onDelete(password);
  };

  return (
    <FormContainer title="계정 탈퇴">
      <p className="text-red-500 mb-4">정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
      
      <div>
        <label className="block text-sm mb-1">비밀번호 확인</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          type="button"
          onClick={handleDelete}
          disabled={loading || !password}
          className="flex-1 bg-red-500 text-white py-2 rounded"
        >
          {loading ? '처리 중...' : '탈퇴'}
        </button>
      </div>
    </FormContainer>
  );
};

export default DeleteAccount;
