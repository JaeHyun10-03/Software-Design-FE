importScripts("https://www.gstatic.com/firebasejs/10.11.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging-compat.js");

const firebaseConfig = {
apiKey: "AIzaSyBD26G8w4Y-52NnFAVXmIo9QHg27NBI95k",
  authDomain: "neeisproject.firebaseapp.com",
  projectId: "neeisproject",
  storageBucket:"neeisproject.firebasestorage.app",
  messagingSenderId: "292766697008",
  appId:"1:292766697008:web:dd647678cb46b7138f0ff5",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
    data: { url: payload.fcmOptions?.link || "/" },
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }
      return clients.openWindow(targetUrl);
    })
  );
});
