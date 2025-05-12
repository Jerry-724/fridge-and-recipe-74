
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  User, 
  Lock, 
  LogOut, 
  Trash2 
} from 'lucide-react';

// Import enhanced components
import EditNickname from './mypage/EditNickname';
import EditPassword from './mypage/EditPassword';
import DeleteAccount from './mypage/DeleteAccount';

type FormMode = 'view' | 'editNickname' | 'editPassword' | 'deleteAccount';

const MyPageForm = () => {
  const [mode, setMode] = useState<FormMode>('view');
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
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
      
      // Update password
      await updateUser({ password: newPassword });
      
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

  // Render MyPage view mode
  const renderViewMode = () => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4">내 정보</h2>
        </div>

        {/* Notification Settings */}
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-4">알림 설정</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell size={18} className="text-gray-500" />
              <span>푸시 알림</span>
            </div>
            <Switch 
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
        </div>

        {/* Account Information */}
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium mb-4">계정 정보</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <User size={18} className="text-gray-500" />
                <span>닉네임</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">{user?.username || '-'}</span>
                <button 
                  onClick={() => setMode('editNickname')}
                  className="text-sm text-primary"
                >
                  변경
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Lock size={18} className="text-gray-500" />
                <span>비밀번호</span>
              </div>
              <button 
                onClick={() => setMode('editPassword')}
                className="text-sm text-primary"
              >
                변경
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <button
            onClick={() => setMode('deleteAccount')}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 text-white bg-red-500 rounded-md hover:bg-red-600"
          >
            <Trash2 size={18} />
            <span>회원 탈퇴</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            <LogOut size={18} />
            <span>로그아웃</span>
          </button>
        </div>
      </div>
    );
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
        return renderViewMode();
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {renderForm()}
    </div>
  );
};

export default MyPageForm;
