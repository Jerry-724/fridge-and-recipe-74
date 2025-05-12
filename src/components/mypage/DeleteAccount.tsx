
import React, { useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import FormContainer from './FormContainer';

interface DeleteAccountProps {
  onCancel: () => void;
  onDelete: (password: string) => Promise<void>;
  loading: boolean;
}

const DeleteAccount: React.FC<DeleteAccountProps> = ({ onCancel, onDelete, loading }) => {
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onDelete(password);
  };
  
  return (
    <FormContainer>
      <Alert className="border-red-500 bg-red-50 mb-6">
        <AlertTriangle className="h-6 w-6 text-red-500" />
        <AlertDescription className="text-red-500 font-medium text-lg">
          계정을 삭제하면 모든 데이터가 영구적으로 제거됩니다.
        </AlertDescription>
      </Alert>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">비밀번호 확인</label>
          <input
            type="password"
            className="input-field"
            placeholder="현재 비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <p className="mt-1 text-xs text-gray-500">
            계정을 삭제하려면 비밀번호를 입력하세요.
          </p>
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
            className="flex-1 bg-red-500 text-white py-3 rounded-md"
            disabled={!password || loading}
          >
            {loading ? '처리 중...' : '탈퇴하기'}
          </button>
        </div>
      </form>
    </FormContainer>
  );
};

export default DeleteAccount;
