'use client';

import { useEffect, useCallback, useRef } from 'react';

function useDebounce<T extends any[]>(callback: (...args: T) => Promise<void>, delay: number) {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    const debouncedCallback = useCallback((...args: T) => {
        const handler = setTimeout(async () => {
            await callbackRef.current(...args);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [delay]);

    return debouncedCallback;
}

export default useDebounce;