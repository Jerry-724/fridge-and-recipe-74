
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from "sonner";

// Import our new components
import ViewMode from './mypage/ViewMode';
import EditNickname from './mypage/EditNickname';
import EditPassword from './mypage/EditPassword';
import DeleteAccount from './mypage/DeleteAccount';

type FormMode = 'view' | 'editNickname' | 'editPassword' | 'deleteAccount';

const MyPageForm = () => {
  const [mode, setMode] = useState<FormMode>('view');
  const [loading, setLoading] = useState(false);
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
      
      // Update nickname
      await updateUser({ username: newNickname });
      
      // Show success toast
      toast("변경되었습니다.");
      
      resetForm();
    } catch (error) {
      console.error(error);
      toast("변경에 실패했습니다.", {
        description: "비밀번호를 확인해주세요.",
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
      
      // Update password
      await updateUser({ password: newPassword });
      
      // Show success toast
      toast("변경되었습니다.");
      
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
      toast("탈퇴되었습니다.");
      
      resetForm();
    } catch (error) {
      console.error(error);
      toast("탈퇴에 실패했습니다.", {
        description: "비밀번호를 확인해주세요.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast("로그아웃되었습니다.");
    } catch (error) {
      console.error(error);
      toast("로그아웃에 실패했습니다.");
    }
  };

  // Render form based on mode using new components
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
          />
        );
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {renderForm()}
    </div>
  );
};

export default MyPageForm;
