
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyANPWKSLfOToDoaLQbGCGlikkZUolMKzl4",
    authDomain: "what-to-eat-41dcc.firebaseapp.com",
    projectId: "what-to-eat-41dcc",
    storageBucket: "what-to-eat-41dcc.firebasestorage.app",
    messagingSenderId: "782329607823",
    appId: "1:782329607823:web:d2641a523a16a62b4922fa",
    measurementId: "G-BTE1R2R416"
  });

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/vite.svg',
  };
  
  // Frontend에 메시지 전달 - 앱 내부에서 메세지를 확인하고 싶은 경우.
  self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clients) {
    clients.forEach(function(client) {
      client.postMessage({
        messageType: 'push-received',
        notification: payload.notification,
      });
    });
  });

  self.registration.showNotification(notificationTitle, notificationOptions);
});