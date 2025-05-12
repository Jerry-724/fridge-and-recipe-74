
import React from 'react';
import FormContainer from './FormContainer';
import { User } from '../../context/AuthContext';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ViewModeProps {
  user: User | null;
  onModeChange: (mode: 'view' | 'editNickname' | 'editPassword' | 'deleteAccount') => void;
  onLogout: () => void;
}

const ViewMode: React.FC<ViewModeProps> = ({ user, onModeChange, onLogout }) => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  return (
    <FormContainer title="내 정보">
      <div className="mt-4 space-y-6">
        {user && (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">아이디</p>
            <p className="font-medium">{user.login_id}</p>
          </div>
        )}
        
        {user && (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">닉네임</p>
            <p className="font-medium">{user.username}</p>
          </div>
        )}
        
        <div className="flex items-center justify-between py-2">
          <Label htmlFor="notifications" className="text-gray-500">푸시 알림</Label>
          <Switch 
            id="notifications"
            checked={notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
          />
        </div>

        <div className="pt-4 space-y-3">
          <button
            onClick={() => onModeChange('editNickname')}
            className="w-full py-3 bg-gray-100 rounded-md text-gray-800 hover:bg-gray-200 transition-colors"
          >
            닉네임 변경
          </button>
          
          <button
            onClick={() => onModeChange('editPassword')}
            className="w-full py-3 bg-gray-100 rounded-md text-gray-800 hover:bg-gray-200 transition-colors"
          >
            비밀번호 변경
          </button>
          
          <button
            onClick={onLogout}
            className="w-full py-3 bg-gray-100 rounded-md text-gray-800 hover:bg-gray-200 transition-colors"
          >
            로그아웃
          </button>
          
          <button
            onClick={() => onModeChange('deleteAccount')}
            className="w-full py-3 border border-red-500 rounded-md text-red-500 hover:bg-red-50 transition-colors mt-4"
          >
            계정 탈퇴
          </button>
        </div>
      </div>
    </FormContainer>
  );
};

export default ViewMode;
