
import React from 'react';
import { User } from '../../types/api';
import FormContainer from './FormContainer';

interface ViewModeProps {
  user: User | null;
  onModeChange: (mode: 'view' | 'editNickname' | 'editPassword' | 'deleteAccount') => void;
  onLogout: () => void;
}

const ViewMode: React.FC<ViewModeProps> = ({ user, onModeChange, onLogout }) => {
  return (
    <FormContainer>
      <div>
        <h2 className="text-xl font-semibold mb-4">내 정보</h2>
        <div className="bg-gray-50 p-4 rounded">
          <div className="mb-2">
            <span className="text-sm text-gray-500">아이디:</span>
            <span className="ml-2">{user?.login_id || '-'}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500">닉네임:</span>
            <span className="ml-2">{user?.username || '-'}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <button
          onClick={() => onModeChange('editNickname')}
          className="w-full bg-white border border-gray-300 py-2 rounded text-left px-4"
        >
          닉네임 변경
        </button>
        <button
          onClick={() => onModeChange('editPassword')}
          className="w-full bg-white border border-gray-300 py-2 rounded text-left px-4"
        >
          비밀번호 변경
        </button>
        <button
          onClick={() => onModeChange('deleteAccount')}
          className="w-full bg-white border border-gray-300 py-2 rounded text-left px-4 text-red-500"
        >
          계정 탈퇴
        </button>
      </div>
      
      <div>
        <button
          onClick={onLogout}
          className="w-full bg-gray-100 py-3 rounded"
        >
          로그아웃
        </button>
      </div>
    </FormContainer>
  );
};

export default ViewMode;
