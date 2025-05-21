// src/App.tsx

import React, { useEffect, useRef, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster as Sonner, toast } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { InventoryProvider } from "./context/InventoryContext";
import { RecipeProvider } from "./context/RecipeContext";

import AuthPage from "./pages/AuthPage";
import InventoryPage from "./pages/InventoryPage";
import RecipePage from "./pages/RecipePage";
import MyPage from "./pages/MyPage";
import NotFound from "./pages/NotFound";
import AuthLayout from "./components/AuthLayout";

// Firebase Messaging
import { getToken, onMessage } from "firebase/messaging";
import { messaging, sendTokenToServer } from "./firebase";

const VAPID_KEY = import.meta.env.VITE_VAPID_KEY || "";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// ✅ 별도의 내부 컴포넌트에서 useAuth 사용
const FCMHandler = () => {
  const [fcmToken, setFcmToken] = useState<string>("");
  const { user } = useAuth();

  // 중복 토스트 방지를 위한 ID 저장소
  const seenIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;
        const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (currentToken) {
          setFcmToken(currentToken);
          await sendTokenToServer(currentToken);
        }
      } catch (err) {
        console.error("FCM token error:", err);
      }
    };
    fetchToken();

    const currentSeenIds = seenIdsRef.current;

    const handleForeground = (payload: any) => {
      const itemId = payload.data?.item_id;
      if (itemId && currentSeenIds.has(itemId)) return;
      if (itemId) currentSeenIds.add(itemId);
      const { title = "", body = "" } = payload.notification ?? {};
      toast(`${title}: ${body}`);
    };

    const unsubscribeOnMessage = onMessage(messaging, handleForeground);

    return () => {
      unsubscribeOnMessage();
      currentSeenIds.clear();
    };
  }, [user]);

  return null; // UI는 필요없음
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <InventoryProvider>
            <RecipeProvider>
              {/* ✅ AuthProvider 하위에서만 FCMHandler 렌더 */}
              <FCMHandler />
              <Sonner position="top-center" closeButton toastOptions={{ duration: 5000 }} />

              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<AuthPage />} />
                  <Route element={<AuthLayout />}>
                    <Route path="/item/:user_id" element={<InventoryPage />} />
                    <Route path="/:user_id/recipe" element={<RecipePage />} />
                    <Route path="/mypage/:user_id" element={<MyPage />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </RecipeProvider>
          </InventoryProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
