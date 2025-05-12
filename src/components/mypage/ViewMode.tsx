
import React, { ReactNode } from 'react';
import { Button } from "@/components/ui/button";

interface ViewModeProps {
  user: {
    username: string;
    email: string;
  } | null;
  onModeChange: (mode: 'editNickname' | 'editPassword' | 'deleteAccount') => void;
  onLogout: () => void;
  notificationSettings?: ReactNode;
}

const ViewMode: React.FC<ViewModeProps> = ({ user, onModeChange, onLogout, notificationSettings }) => {
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <h2 className="text-lg font-medium mb-4 mt-1">내 정보</h2>
        
        <div className="space-y-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">닉네임</div>
            <div className="flex justify-between items-center">
              <div className="font-medium">{user?.username || '로드 중...'}</div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onModeChange('editNickname')}
              >
                변경
              </Button>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm text-gray-500 mb-1">이메일</div>
            <div>{user?.email || '로드 중...'}</div>
          </div>
          
          {notificationSettings}
          
          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm text-gray-500 mb-1">비밀번호</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onModeChange('editPassword')}
            >
              비밀번호 변경
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-medium text-gray-500">계정 관리</h3>
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onLogout}
          >
            로그아웃
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={() => onModeChange('deleteAccount')}
          >
            계정 탈퇴
          </Button>
        </div>
      </div>
    </>
  );
};

export default ViewMode;
