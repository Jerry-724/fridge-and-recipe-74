import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from "sonner";

type FormMode = 'view' | 'editNickname' | 'editPassword' | 'deleteAccount';

const MyPageForm = () => {
  const [mode, setMode] = useState<FormMode>('view');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, updateUser, deleteAccount, logout } = useAuth();

  const resetForm = () => {
    setCurrentPassword('');
    setNewNickname('');
    setNewPassword('');
    setConfirmPassword('');
    setMode('view');
  };

  const handleSubmitNickname = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // In a real app, validate password before allowing changes
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

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const handleDeleteAccount = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (currentPassword !== '1234') { // Mock password check
        throw new Error('비밀번호가 일치하지 않습니다.');
      }
      
      // Delete account - passing the current password to the function
      await deleteAccount(currentPassword);
      
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

  // Render different forms based on mode
  const renderForm = () => {
    switch (mode) {
      case 'editNickname':
        return (
          <form onSubmit={handleSubmitNickname} className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">닉네임 변경</h2>
            
            <div>
              <label className="block text-sm mb-1">현재 비밀번호</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">새 닉네임</label>
              <input
                type="text"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="flex space-x-2 pt-4">
              <button
                type="button"
                onClick={() => setMode('view')}
                className="flex-1 py-2 border rounded"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-white py-2 rounded"
              >
                {loading ? '처리 중...' : '변경'}
              </button>
            </div>
          </form>
        );
        
      case 'editPassword':
        return (
          <form onSubmit={handleSubmitPassword} className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">비밀번호 변경</h2>
            
            <div>
              <label className="block text-sm mb-1">현재 비밀번호</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">새 비밀번호</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">새 비밀번호 확인</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="flex space-x-2 pt-4">
              <button
                type="button"
                onClick={() => setMode('view')}
                className="flex-1 py-2 border rounded"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-white py-2 rounded"
              >
                {loading ? '처리 중...' : '변경'}
              </button>
            </div>
          </form>
        );
        
      case 'deleteAccount':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">계정 탈퇴</h2>
            <p className="text-red-500 mb-4">정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
            
            <div>
              <label className="block text-sm mb-1">비밀번호 확인</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="flex space-x-2 pt-4">
              <button
                type="button"
                onClick={() => setMode('view')}
                className="flex-1 py-2 border rounded"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={loading || !currentPassword}
                className="flex-1 bg-red-500 text-white py-2 rounded"
              >
                {loading ? '처리 중...' : '탈퇴'}
              </button>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="space-y-6">
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
                onClick={() => setMode('editNickname')}
                className="w-full bg-white border border-gray-300 py-2 rounded text-left px-4"
              >
                닉네임 변경
              </button>
              <button
                onClick={() => setMode('editPassword')}
                className="w-full bg-white border border-gray-300 py-2 rounded text-left px-4"
              >
                비밀번호 변경
              </button>
              <button
                onClick={() => setMode('deleteAccount')}
                className="w-full bg-white border border-gray-300 py-2 rounded text-left px-4 text-red-500"
              >
                계정 탈퇴
              </button>
            </div>
            
            <div>
              <button
                onClick={handleLogout}
                className="w-full bg-gray-100 py-3 rounded"
              >
                로그아웃
              </button>
            </div>
          </div>
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
