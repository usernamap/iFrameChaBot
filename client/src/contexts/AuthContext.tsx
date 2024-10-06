import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser } from '@/utils/auth';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const currentUser = await getCurrentUser();
                    setUser(currentUser);
                }
            } catch (error) {
                console.error('Failed to get current user:', error);
                localStorage.removeItem('token');
            }
        };
        checkUser();
    }, []);

    const login = async (email: string, password: string) => {
        const { user, token } = await apiLogin(email, password);
        localStorage.setItem('token', token);
        setUser(user);
    };

    const register = async (name: string, email: string, password: string) => {
        const { user, token } = await apiRegister(name, email, password);
        localStorage.setItem('token', token);
        setUser(user);
    };

    const logout = async () => {
        await apiLogout();
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = { user, login, register, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
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