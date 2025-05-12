
import React from 'react';
import FormContainer from './FormContainer';
import { User } from '../../context/AuthContext';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChevronRight } from 'lucide-react';

interface ViewModeProps {
  user: User | null;
  onModeChange: (mode: 'view' | 'editNickname' | 'editPassword' | 'deleteAccount') => void;
  onLogout: () => void;
}

const ViewMode: React.FC<ViewModeProps> = ({ user, onModeChange, onLogout }) => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-medium mb-4">알림 설정</h2>
        
        <div className="flex items-center justify-between py-2">
          <Label htmlFor="notifications" className="text-gray-700">푸시 알림</Label>
          <Switch 
            id="notifications"
            checked={notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
          />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm">
        <h2 className="text-lg font-medium p-6 pb-2">계정 정보</h2>
        
        {user && (
          <div className="border-b border-gray-100 px-6 py-3 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">아이디</p>
              <p className="font-medium">{user.login_id}</p>
            </div>
          </div>
        )}
        
        {user && (
          <div className="border-b border-gray-100 px-6 py-3 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">닉네임</p>
              <p className="font-medium">{user.username}</p>
            </div>
            <button onClick={() => onModeChange('editNickname')} className="text-green-600">
              <span className="flex items-center">변경 <ChevronRight size={16} /></span>
            </button>
          </div>
        )}
        
        <div className="border-b border-gray-100 px-6 py-3 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">비밀번호</p>
            <p className="font-medium">********</p>
          </div>
          <button onClick={() => onModeChange('editPassword')} className="text-green-600">
            <span className="flex items-center">변경 <ChevronRight size={16} /></span>
          </button>
        </div>
        
        <div className="px-6 py-4">
          <button
            onClick={onLogout}
            className="w-full py-3 bg-gray-100 rounded-md text-gray-800 hover:bg-gray-200 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <button
          onClick={() => onModeChange('deleteAccount')}
          className="w-full py-3 border border-red-500 rounded-md text-red-500 hover:bg-red-50 transition-colors"
        >
          계정 탈퇴
        </button>
      </div>
    </div>
  );
};

export default ViewMode;
