import { initializeApp, getApps, FirebaseApp, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider, TwitterAuthProvider, OAuthProvider, EmailAuthProvider } from 'firebase/auth';
import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let firebaseApp: FirebaseApp;
let messaging: Messaging | null = null;

if (typeof window !== 'undefined') {
    firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    try {
        messaging = getMessaging(firebaseApp);
    } catch (error) {
        console.error('Error initializing messaging:', error);
    }
} else {
    firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
}


const auth = getAuth(firebaseApp);
const emailProvider = new EmailAuthProvider();
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();
const twitterProvider = new TwitterAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');

export async function requestNotificationPermission() {
    if (typeof window !== 'undefined' && messaging) {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('Notification permission granted.');

                // Vérifiez si le service worker est disponible
                if ('serviceWorker' in navigator) {
                    const registration = await navigator.serviceWorker.ready;
                    const token = await getToken(messaging, {
                        vapidKey: 'VOTRE_CLE_VAPID',
                        serviceWorkerRegistration: registration
                    });

                    if (token) {
                        console.log('Token received:', token);
                        await sendTokenToServer(token);
                    } else {
                        console.log('No registration token available. Request permission to generate one.');
                    }
                } else {
                    console.log('Service workers are not supported in this browser');
                }
            } else {
                console.log('Unable to get permission to notify.');
            }
        } catch (err) {
            console.log('An error occurred while retrieving token. ', err);
        }
    }
}

async function sendTokenToServer(token: string) {
    // Implémentez cette fonction pour envoyer le token à votre serveur
    console.log('Sending token to server:', token);
}

export function subscribeToTopic(token: string, topic: string) {
    // Implémentez cette fonction pour s'abonner à un topic sur votre serveur
    console.log(`Subscribing to topic ${topic} with token ${token}`);
}

export function onMessageListener() {
    if (typeof window !== 'undefined' && messaging) {
        return new Promise((resolve) => {
            onMessage(messaging, (payload) => {
                resolve(payload);
            });
        });
    }
    return Promise.resolve(null);
}

export { auth, emailProvider, googleProvider, facebookProvider, githubProvider, twitterProvider, microsoftProvider };