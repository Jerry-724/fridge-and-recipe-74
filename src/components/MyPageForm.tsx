
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Import our enhanced components
import ViewMode from './mypage/ViewMode';
import EditNickname from './mypage/EditNickname';
import EditPassword from './mypage/EditPassword';
import DeleteAccount from './mypage/DeleteAccount';

type FormMode = 'view' | 'editNickname' | 'editPassword' | 'deleteAccount';

const MyPageForm = () => {
  const [mode, setMode] = useState<FormMode>('view');
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const { user, updateUser, deleteAccount, logout } = useAuth();

  const resetForm = () => {
    setMode('view');
  };

  const handleSubmitNickname = async (currentPassword: string, newNickname: string) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (currentPassword !== '1234') { // Mock password check
        throw new Error('비밀번호가 일치하지 않습니다.');
      }
      
      // Update nickname - pass the password as well
      await updateUser({ username: newNickname, password: currentPassword });
      
      // Show success toast
      toast("변경되었습니다.", { duration: 1000 });
      
      resetForm();
    } catch (error: any) {
      console.error(error);
      toast("변경에 실패했습니다.", {
        description: error.message || "비밀번호를 확인해주세요.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    setLoading(true);
    
    try {
      // Validate passwords
      if (newPassword !== confirmPassword) {
        throw new Error('새 비밀번호가 일치하지 않습니다.');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (currentPassword !== '1234') { // Mock password check
        throw new Error('비밀번호가 일치하지 않습니다.');
      }
      
      // Update password - pass both the current and new password
      await updateUser({ password: currentPassword, newPassword });
      
      // Show success toast
      toast("변경되었습니다.", { duration: 1000 });
      
      resetForm();
    } catch (error: any) {
      console.error(error);
      toast("변경에 실패했습니다.", {
        description: error.message || "오류가 발생했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (password: string) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (password !== '1234') { // Mock password check
        throw new Error('비밀번호가 일치하지 않습니다.');
      }
      
      // Delete account - passing the current password to the function
      await deleteAccount(password);
      
      // Show success toast
      toast("탈퇴되었습니다.", { duration: 1000 });
      
      resetForm();
    } catch (error: any) {
      console.error(error);
      toast("탈퇴에 실패했습니다.", {
        description: error.message || "비밀번호를 확인해주세요.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast("로그아웃되었습니다.", { duration: 1000 });
    } catch (error) {
      console.error(error);
      toast("로그아웃에 실패했습니다.");
    }
  };

  const handleToggleNotifications = (checked: boolean) => {
    setNotifications(checked);
    toast(`알림 ${checked ? '활성화' : '비활성화'} 되었습니다.`, { duration: 1000 });
  };

  // Render form based on mode using enhanced components
  const renderForm = () => {
    switch (mode) {
      case 'editNickname':
        return (
          <EditNickname 
            onCancel={() => setMode('view')} 
            onSubmit={handleSubmitNickname} 
            loading={loading} 
          />
        );
        
      case 'editPassword':
        return (
          <EditPassword 
            onCancel={() => setMode('view')} 
            onSubmit={handleSubmitPassword} 
            loading={loading} 
          />
        );
        
      case 'deleteAccount':
        return (
          <DeleteAccount 
            onCancel={() => setMode('view')} 
            onDelete={handleDeleteAccount} 
            loading={loading} 
          />
        );
        
      default:
        return (
          <ViewMode 
            user={user}
            onModeChange={setMode}
            onLogout={handleLogout}
            notificationSettings={
              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <Label htmlFor="notifications" className="text-sm">푸시 알림</Label>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={handleToggleNotifications}
                />
              </div>
            }
          />
        );
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-6">
      {renderForm()}
    </div>
  );
};

export default MyPageForm;
