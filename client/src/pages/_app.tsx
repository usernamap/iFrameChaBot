import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import '@/styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from 'react-hot-toast';
import { requestNotificationPermission } from '../config/firebase';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            requestNotificationPermission();
        }
    }, []);

    return (
        <AuthProvider>
            {/* <Elements stripe={stripePromise}> */}
            <Component {...pageProps} />
            <div id="portal-root"></div>
            {/* </Elements> */}
            <ToastContainer />
            <Toaster />
        </AuthProvider>
    );
}

export default MyApp;