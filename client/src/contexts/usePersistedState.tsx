import { useState, useEffect } from 'react';

function usePersistedState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState<T>(() => {
        if (typeof window !== 'undefined') {
            try {
                const persistedState = localStorage.getItem(key);
                if (persistedState === null) {
                    return defaultValue;
                }
                // Essayez de parser, si ça échoue, retournez la valeur brute
                const parsedState = JSON.parse(persistedState);
                return parsedState;
            } catch (error) {
                console.warn(`Error reading ${key} from localStorage:`, error);
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