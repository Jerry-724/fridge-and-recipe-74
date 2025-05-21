// 새 파일 생성: src/components/FirebaseInitializer.tsx

import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { getToken, onMessage } from "firebase/messaging";
import { messaging, sendTokenToServer } from "../firebase";
import { toast } from "sonner";

const VAPID_KEY = import.meta.env.VITE_VAPID_KEY || "";

export default function FirebaseInitializer() {
  const { user } = useAuth();               // AuthProvider 내부에서만 호출 가능
  const seenIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;                      // 로그인 전엔 아무것도 하지 않음

    // 1) 권한 요청 & 토큰 발급 → 서버 등록
    (async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;
        const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (currentToken) {
          await sendTokenToServer(currentToken);
        }
      } catch (err) {
        console.error("FCM token error:", err);
      }
    })();

    // 2) 포그라운드 메시지 수신 (중복 제거)
    const unsubscribe = onMessage(messaging, (payload) => {
      const itemId = payload.data?.item_id;
      if (itemId && seenIdsRef.current.has(itemId)) return;
      if (itemId) seenIdsRef.current.add(itemId);

      const { title = "", body = "" } = payload.notification ?? {};
      toast(`${title}: ${body}`);
    });

    return () => {
      unsubscribe();
      seenIdsRef.current.clear();
    };
  }, [user]);

  return null;
}
