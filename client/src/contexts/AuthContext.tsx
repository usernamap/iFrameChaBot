import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, googleProvider, facebookProvider, githubProvider, twitterProvider, microsoftProvider } from '../config/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User, AuthError, signInWithEmailAndPassword } from 'firebase/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    loginWithFacebook: () => Promise<void>;
    loginWithGithub: () => Promise<void>;
    loginWithTwitter: () => Promise<void>;
    loginWithMicrosoft: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const loginWithEmail = async (email: string, password: string) => {
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            const authError = error as AuthError;
            setError(`Échec de la connexion: ${authError.code} - ${authError.message}`);
            console.error('Login error:', authError);
        }
    }
    const loginWithGoogle = async () => {
        setError(null);
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            const authError = error as AuthError;
            setError(`Échec de la connexion avec Google: ${authError.code} - ${authError.message}`);
            console.error('Google login error:', authError);
        }
    };

    const loginWithFacebook = async () => {
        setError(null);
        try {
            await signInWithPopup(auth, facebookProvider);
        } catch (error) {
            const authError = error as AuthError;
            setError(`Échec de la connexion avec Facebook: ${authError.code} - ${authError.message}`);
            console.error('Facebook login error:', authError);
        }
    };

    const loginWithGithub = async () => {
        setError(null);
        try {
            await signInWithPopup(auth, githubProvider);
        } catch (error) {
            const authError = error as AuthError;
            setError(`Échec de la connexion avec GitHub: ${authError.code} - ${authError.message}`);
            console.error('GitHub login error:', authError);
        }
    }

    const loginWithTwitter = async () => {
        setError(null);
        try {
            await signInWithPopup(auth, twitterProvider);
        } catch (error) {
            const authError = error as AuthError;
            setError(`Échec de la connexion avec Twitter: ${authError.code} - ${authError.message}`);
            console.error('Twitter login error:', authError);
        }
    }

    const loginWithMicrosoft = async () => {
        setError(null);
        try {
            await signInWithPopup(auth, microsoftProvider);
        } catch (error) {
            const authError = error as AuthError;
            setError(`Échec de la connexion avec Microsoft: ${authError.code} - ${authError.message}`);
            console.error('Microsoft login error:', authError);
        }
    }

    const logout = async () => {
        setError(null);
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            const authError = error as AuthError;
            setError(`Échec de la déconnexion: ${authError.code} - ${authError.message}`);
            console.error('Logout error:', authError);
        }
    };

    useEffect(() => {
        console.log('AuthContext: Initializing auth state listener');
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log('AuthContext: Auth state changed', user);
            setUser(user);
            setLoading(false);
        });

        return () => {
            console.log('AuthContext: Cleaning up auth state listener');
            unsubscribe();
        };
    }, []);

    const value = React.useMemo(() => ({
        user,
        loading,
        error,
        loginWithEmail,
        loginWithGoogle,
        loginWithFacebook,
        loginWithGithub,
        loginWithTwitter,
        loginWithMicrosoft,
        logout
    }), [user, loading, error]);

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};