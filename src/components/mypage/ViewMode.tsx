
import React from 'react';
import { User } from '../../types/api';
import FormContainer from './FormContainer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User as UserIcon, Settings, Lock, LogOut, Trash2 } from "lucide-react";

interface ViewModeProps {
  user: User | null;
  onModeChange: (mode: 'view' | 'editNickname' | 'editPassword' | 'deleteAccount') => void;
  onLogout: () => void;
}

const ViewMode: React.FC<ViewModeProps> = ({ user, onModeChange, onLogout }) => {
  return (
    <FormContainer>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">내 정보</h2>
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">아이디:</span>
              <span>{user?.login_id || '-'}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">닉네임:</span>
              <span>{user?.username || '-'}</span>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-2">
          <Button
            onClick={() => onModeChange('editNickname')}
            variant="outline"
            className="w-full justify-start text-left"
          >
            <UserIcon className="mr-2 h-4 w-4" />
            닉네임 변경
          </Button>
          <Button
            onClick={() => onModeChange('editPassword')}
            variant="outline"
            className="w-full justify-start text-left"
          >
            <Lock className="mr-2 h-4 w-4" />
            비밀번호 변경
          </Button>
          <Button
            onClick={() => onModeChange('deleteAccount')}
            variant="outline"
            className="w-full justify-start text-left text-destructive hover:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            계정 탈퇴
          </Button>
        </div>
        
        <div>
          <Button
            onClick={onLogout}
            variant="secondary"
            className="w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            로그아웃
          </Button>
        </div>
      </div>
    </FormContainer>
  );
};

export default ViewMode;
