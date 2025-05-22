// src/components/MyPageForm.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Bell, User, Lock, LogOut, Trash2 } from 'lucide-react';

import EditNickname from './mypage/EditNickname';
import EditPassword from './mypage/EditPassword';
import DeleteAccount from './mypage/DeleteAccount';
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

type FormMode = 'view' | 'editNickname' | 'editPassword' | 'deleteAccount';

const MyPageForm: React.FC = () => {
  const [mode, setMode] = useState<FormMode>('view');
  const [loading, setLoading] = useState(false);

  const { user, updateUser, deleteAccount, logout } = useAuth();
  // notification 상태를 user에서 받아오고 항상 동기화
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(
      user?.notification ?? true  // undefined/null이면 true로 간주
  );
  // user.notification 값이 바뀌면 알림 토글 상태도 동기화
  useEffect(() => {
  setNotificationsEnabled(user?.notification ?? true);
}, [user?.notification]);

  // 알림 설정 토글 핸들러 (PATCH + 동기화)
  const handleToggleNotifications = async (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    try {
      await api.patch(
        `/user/me/notification`,
        null,
        {
          params: { enabled },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );
      // PATCH 후 반드시 최신 user 객체 fetch & 상태 동기화
      const updatedUserData = await api.get(`/mypage/${user!.user_id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      localStorage.setItem("user", JSON.stringify(updatedUserData.data));
      await updateUser(updatedUserData.data);

      toast("알림 설정이 변경되었습니다.");
    } catch (error) {
      toast.error("알림 설정 저장에 실패했습니다.");
      setNotificationsEnabled((prev) => !prev); // 롤백
    }
  };

  // 닉네임 변경 핸들러
  const handleSubmitNickname = async (currentPassword: string, newNickname: string) => {
    setLoading(true);
    try {
      const response = await api.patch(`/user/${user.user_id}/username`, {
        password: currentPassword,
        new_username: newNickname
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "ngrok-skip-browser-warning": "true"
        }
      });

      const updatedUserData = await api.get(`/mypage/${user.user_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "ngrok-skip-browser-warning": "true"
        }
      });
      localStorage.setItem("user", JSON.stringify(updatedUserData.data));

      await updateUser(updatedUserData.data);

      toast(response.data.message, { duration: 1000 });
      setMode('view');
    } catch (error: any) {
      console.error(error);
      toast("변경에 실패했습니다.", {
        description: error.message || "비밀번호를 확인해주세요.",
      });
    } finally {
      setLoading(false);
    }
  };

  // 비밀번호 변경 핸들러
  const handleSubmitPassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    setLoading(true);
    try {
      if (newPassword !== confirmPassword) {
        throw new Error('새 비밀번호가 일치하지 않습니다.');
      }
      if (newPassword === currentPassword) {
        throw new Error('기존 비밀번호와 동일한 비밀번호로는 변경할 수 없습니다.');
      }

      const response = await api.patch(`/user/${user.user_id}/password`, {
        password: currentPassword,
        new_password: newPassword
      }, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })

      toast(response.data.message || "비밀번호가 성공적으로 변경되었습니다.", { duration: 1000 });

      await logout();
      toast("변경된 비밀번호로 다시 로그인해주세요.", { duration: 1000 });
      setMode('view');
    } catch (error: any) {
      console.error(error);
      toast("변경에 실패했습니다.", {
        description: error.message || "오류가 발생했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  // 회원 탈퇴 핸들러
  const handleDeleteAccount = async (password: string) => {
    setLoading(true);
    try {
      await deleteAccount(password);
      toast("탈퇴되었습니다.", { duration: 1000 });
      setMode('view');
    } catch (error: any) {
      console.error(error);
      toast("탈퇴에 실패했습니다.", {
        description: error.message || "비밀번호를 확인해주세요.",
      });
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await logout();
      toast("로그아웃되었습니다.", { duration: 1000 });
    } catch (error) {
      console.error(error);
      toast("로그아웃에 실패했습니다.");
    }
  };

  // Render view mode
  const renderViewMode = () => (
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
            onCheckedChange={handleToggleNotifications}
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

  // Render form
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
