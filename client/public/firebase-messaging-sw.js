importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyC46wS3pKyl4zd5TMxgX6i0a2uy0uCVf4w",
  authDomain: "ssfw515-65303.firebaseapp.com",
  projectId: "ssfw515-65303",
  storageBucket: "ssfw515-65303.appspot.com",
  messagingSenderId: "394431230132",
  appId: "1:394431230132:web:33237c3dc5a604fb0c27e1"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});