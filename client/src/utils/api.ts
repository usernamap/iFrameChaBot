import axios, { AxiosError } from 'axios';
import { ApiError } from '../types';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


export const getChatbotConfig = async (chatbotId: string) => {
    const response = await api.get(`/chatbot/${chatbotId}/config`);
    return response.data;
};

// export const getUserChatbots = async () => {
//     const response = await api.get('/user/chatbots');
//     return response.data;
// };

export const createChatbot = async (chatbotData: any) => {
    const response = await api.post('/chatbot', chatbotData);
    return response.data;
};

export const updateChatbot = async (chatbotId: string, chatbotData: any) => {
    const response = await api.put(`/chatbot/${chatbotId}`, chatbotData);
    return response.data;
};

export const deleteChatbot = async (chatbotId: string) => {
    const response = await api.delete(`/chatbot/${chatbotId}`);
    return response.data;
};

// Ajouter un intercepteur pour inclure le token d'authentification
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export default api;