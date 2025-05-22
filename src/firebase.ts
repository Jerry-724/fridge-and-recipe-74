import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

// 1. Firebase 설정 및 초기화 로깅
const firebaseConfig = {
  apiKey: "AIzaSyANPWKSLfOToDoaLQbGCGlikkZUolMKzl4",
  authDomain: "what-to-eat-41dcc.firebaseapp.com",
  projectId: "what-to-eat-41dcc",
  storageBucket: "what-to-eat-41dcc.firebasestorage.app",
  messagingSenderId: "782329607823",
  appId: "1:782329607823:web:d2641a523a16a62b4922fa",
  measurementId: "G-BTE1R2R416"
};

console.log("[firebase.ts] Firebase config:", firebaseConfig);

let app;
try {
  app = initializeApp(firebaseConfig);
  console.log("[firebase.ts] Firebase initialized successfully");
} catch (err) {
  console.error("[firebase.ts] Firebase initialization error:", err);
}

let messaging;
try {
  messaging = getMessaging(app);
  console.log("[firebase.ts] Firebase Messaging initialized successfully");
} catch (err) {
  console.error("[firebase.ts] Firebase Messaging initialization error:", err);
}

const TOKEN_REGISTER_URL: string = import.meta.env.VITE_TOKEN_REGISTER_URL || "";
console.log("[firebase.ts] TOKEN_REGISTER_URL:", TOKEN_REGISTER_URL);

export const sendTokenToServer = async (token: string) => {
  // 1) localStorage 에 로그인 직후 저장해둔 user 객체에서 user_id 가져오기
  const userJson = localStorage.getItem("user");
  if (!userJson) {
    console.warn("[firebase.ts] No user in localStorage — skipping token registration");
    return;
  }
  let user_id;
  try {
    user_id = JSON.parse(userJson).user_id;
    console.log("[firebase.ts] user_id from localStorage:", user_id);
  } catch (err) {
    console.error("[firebase.ts] Error parsing user from localStorage:", err);
    return;
  }

  // 2) user_id 와 token 을 함께 서버로 전송
  try {
    const response = await fetch(TOKEN_REGISTER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, token }),
    });
    if (response.ok) {
      console.log("[firebase.ts] FCM token registered for user:", user_id);
    } else {
      console.error("[firebase.ts] FCM token registration failed. Status:", response.status);
      const errorText = await response.text();
      console.error("[firebase.ts] Server response:", errorText);
    }
  } catch (err) {
    console.error("[firebase.ts] Error registering FCM token:", err);
  }
};

export { messaging };
