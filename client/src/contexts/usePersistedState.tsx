import { useState, useEffect } from 'react';

function usePersistedState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState<T>(() => {
        if (typeof window !== 'undefined') {
            try {
                // Vérifiez si l'accès à localStorage est possible
                const testKey = '__test__';
                localStorage.setItem(testKey, 'test');
                localStorage.removeItem(testKey);

                const persistedState = localStorage.getItem(key);
                if (persistedState === null) {
                    return defaultValue;
                }
                const parsedState = JSON.parse(persistedState);
                return parsedState;
            } catch (error) {
                console.warn(`Error reading or writing ${key} in localStorage:`, error);
                // Retourner la valeur par défaut si localStorage n'est pas accessible
                return defaultValue;
            }
        }
        return defaultValue;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem(key, JSON.stringify(state));
            } catch (error) {
                console.warn(`Error writing ${key} to localStorage:`, error);
            }
        }
    }, [key, state]);

    return [state, setState];
}

export default usePersistedState;
