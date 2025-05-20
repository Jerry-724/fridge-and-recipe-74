import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyANPWKSLfOToDoaLQbGCGlikkZUolMKzl4",
  authDomain: "what-to-eat-41dcc.firebaseapp.com",
  projectId: "what-to-eat-41dcc",
  storageBucket: "what-to-eat-41dcc.firebasestorage.app",
  messagingSenderId: "782329607823",
  appId: "1:782329607823:web:d2641a523a16a62b4922fa",
  measurementId: "G-BTE1R2R416"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);


const TOKEN_REGISTER_URL: string = import.meta.env.VITE_TOKEN_REGISTER_URL || "";

export const sendTokenToServer = async (token: string) => {
  // 1) localStorage 에 로그인 직후 저장해둔 user 객체에서 user_id 가져오기
  const userJson = localStorage.getItem("user");
  if (!userJson) {
    console.warn("No user in localStorage — skipping token registration");
    return;
  }
  const { user_id } = JSON.parse(userJson);

  // 2) user_id 와 token 을 함께 서버로 전송
  try {
    await fetch(TOKEN_REGISTER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, token }),
    });
    console.log("FCM token registered for user:", user_id);
  } catch (err) {
    console.error("Error registering FCM token:", err);
  }
};

export { messaging };