import { useState, useCallback } from 'react';

const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const addMessage = useCallback((message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  const markMessageAsRead = useCallback((messageId) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
  }, []);

  const retryLastMessage = useCallback(() => {
    const lastUserMessage = messages.filter(m => !m.isBot).pop();
    if (lastUserMessage) {
      console.log('Retrying last message:', lastUserMessage.text);
        addMessage(lastUserMessage);
    }
  }, [messages]);

  return {
    messages,
    addMessage,
    isLoading,
    setIsLoading,
    error,
    setError,
    retryLastMessage,
    markMessageAsRead,
  };
};

export default useChat;