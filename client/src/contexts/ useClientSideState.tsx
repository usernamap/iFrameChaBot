import { useState, useEffect } from 'react';

function useClientSideState<T>(initialState: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState<T | null>(null);

    useEffect(() => {
        setState(initialState);
    }, [initialState]);

    return [state === null ? initialState : state, setState];
}

export default useClientSideState;