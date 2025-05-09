
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

const MyPageForm: React.FC = () => {
  const { user, updateUser, logout, deleteAccount } = useAuth();
  const { toast } = useToast();
  
  // Modal states
  const [isChangeNicknameOpen, setIsChangeNicknameOpen] = useState<boolean>(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState<boolean>(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState<boolean>(false);
  
  // Form states
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newUsername, setNewUsername] = useState<string>('');
  const [notification, setNotification] = useState<boolean>(user?.notification || false);
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const handleNotificationChange = async () => {
    try {
      await updateUser({ notification: !notification });
      setNotification(!notification);
      toast({
        title: '알림 설정이 변경되었습니다.',
      });
    } catch (error) {
      toast({
        title: '오류',
        description: '알림 설정 변경에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };
  
  const handleChangeNickname = async () => {
    if (!newUsername) {
      toast({
        title: '오류',
        description: '새 닉네임을 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await updateUser({ username: newUsername });
      setSuccessMessage('변경되었습니다.');
      setTimeout(() => {
        setSuccessMessage(null);
        setIsChangeNicknameOpen(false);
        setNewUsername('');
        setCurrentPassword('');
      }, 2000);
    } catch (error) {
      toast({
        title: '오류',
        description: '닉네임 변경에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };
  
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast({
        title: '오류',
        description: '모든 필드를 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // In a real app, verify current password and update password
      // For demo, we'll just show success
      setSuccessMessage('변경되었습니다.');
      setTimeout(() => {
        setSuccessMessage(null);
        setIsChangePasswordOpen(false);
        setNewPassword('');
        setCurrentPassword('');
      }, 2000);
    } catch (error) {
      toast({
        title: '오류',
        description: '비밀번호 변경에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };
  
  const handleDeleteAccount = async () => {
    if (!deleteConfirmPassword) {
      toast({
        title: '오류',
        description: '비밀번호를 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await deleteAccount(deleteConfirmPassword);
      setSuccessMessage('탈퇴되었습니다.');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
    } catch (error) {
      toast({
        title: '오류',
        description: '계정 삭제에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: '로그아웃 되었습니다.',
    });
  };
  
  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <h3 className="text-lg font-medium mb-4">알림 설정</h3>
        <div className="flex items-center justify-between">
          <span>푸시 알림</span>
          <Switch
            checked={notification}
            onCheckedChange={handleNotificationChange}
          />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <h3 className="text-lg font-medium mb-4">계정 정보</h3>
        
        <div className="flex items-center justify-between py-3 border-b">
          <span>닉네임</span>
          <div className="flex items-center">
            <span className="mr-2 text-gray-700">{user?.username}</span>
            <button 
              onClick={() => setIsChangeNicknameOpen(true)}
              className="text-primary text-sm"
            >
              변경
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between py-3">
          <span>비밀번호</span>
          <button 
            onClick={() => setIsChangePasswordOpen(true)}
            className="text-primary text-sm"
          >
            변경
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <button 
          onClick={() => setIsDeleteAccountOpen(true)}
          className="w-full py-3 text-destructive border border-destructive rounded-md"
        >
          회원 탈퇴
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <button 
          onClick={() => setIsLogoutConfirmOpen(true)}
          className="w-full py-3 bg-gray-200 text-gray-800 rounded-md"
        >
          로그아웃
        </button>
      </div>
      
      {/* Change Nickname Dialog */}
      <Dialog open={isChangeNicknameOpen} onOpenChange={setIsChangeNicknameOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>닉네임 변경</DialogTitle>
          </DialogHeader>
          {successMessage ? (
            <div className="py-10 text-center">
              <p className="text-primary">{successMessage}</p>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <input
                type="password"
                className="input-field"
                placeholder="현재 비밀번호"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <input
                type="text"
                className="input-field"
                placeholder="새 닉네임"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => setIsChangeNicknameOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  취소
                </button>
                <button 
                  onClick={handleChangeNickname}
                  className="px-4 py-2 bg-primary text-white rounded-md"
                >
                  변경
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>비밀번호 변경</DialogTitle>
          </DialogHeader>
          {successMessage ? (
            <div className="py-10 text-center">
              <p className="text-primary">{successMessage}</p>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <input
                type="password"
                className="input-field"
                placeholder="현재 비밀번호"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <input
                type="password"
                className="input-field"
                placeholder="새 비밀번호"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  취소
                </button>
                <button 
                  onClick={handleChangePassword}
                  className="px-4 py-2 bg-primary text-white rounded-md"
                >
                  변경
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Account Dialog */}
      <Dialog open={isDeleteAccountOpen} onOpenChange={setIsDeleteAccountOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">정말 탈퇴하시겠어요?</DialogTitle>
          </DialogHeader>
          {successMessage ? (
            <div className="py-10 text-center">
              <p className="text-primary">{successMessage}</p>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <input
                type="password"
                className="input-field"
                placeholder="비밀번호 확인"
                value={deleteConfirmPassword}
                onChange={(e) => setDeleteConfirmPassword(e.target.value)}
              />
              <div className="flex justify-center space-x-4">
                <button 
                  onClick={() => setIsDeleteAccountOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md"
                >
                  취소
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  className="px-6 py-2 bg-destructive text-white rounded-md"
                >
                  탈퇴
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Logout Confirm Dialog */}
      <Dialog open={isLogoutConfirmOpen} onOpenChange={setIsLogoutConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">로그아웃 하시겠습니까?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="px-6 py-2 border border-gray-300 rounded-md"
              >
                취소
              </button>
              <button 
                onClick={handleLogout}
                className="px-6 py-2 bg-primary text-white rounded-md"
              >
                확인
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyPageForm;
