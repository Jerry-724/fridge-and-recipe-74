// src/App.tsx

import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster as Sonner, toast } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "./context/AuthContext";
import { InventoryProvider } from "./context/InventoryContext";
import { RecipeProvider } from "./context/RecipeContext";

import AuthPage from "./pages/AuthPage";
import InventoryPage from "./pages/InventoryPage";
import RecipePage from "./pages/RecipePage";
import MyPage from "./pages/MyPage";
import NotFound from "./pages/NotFound";
import AuthLayout from "./components/AuthLayout";

// Firebase Messaging import
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

const App = () => {
  const [fcmToken, setFcmToken] = useState<string>("");
  const [pushMsg, setPushMsg] = useState<{ title: string; body: string } | null>(null);

  useEffect(() => {
    // 1) 권한 요청 & 토큰 발급
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

    // 2) 포그라운드 메시지 핸들러
    const handleForeground = (payload: any) => {
      const { title = "", body = "" } = payload.notification ?? {};
      setPushMsg({ title, body });
      toast(`${title}: ${body}`);
    };
    const unsubscribeOnMessage = onMessage(messaging, handleForeground);

    // 3) 백그라운드 메시지 핸들러 (서비스워커)
    const handleSWMessage = (event: MessageEvent) => {
      const data = event.data;
      if (data?.messageType === "push-received") {
        const { title = "", body = "" } = data.notification ?? {};
        setPushMsg({ title, body });
        toast(`${title}: ${body}`);
      }
    };
    navigator.serviceWorker.addEventListener("message", handleSWMessage);

    // cleanup: 리스너 제거
    return () => {
      unsubscribeOnMessage();
      navigator.serviceWorker.removeEventListener("message", handleSWMessage);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <InventoryProvider>
            <RecipeProvider>
              <Sonner position="top-center" closeButton toastOptions={{ duration: 3000 }} />

              {/* 라우팅 */}
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
