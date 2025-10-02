import { useState, useEffect, useRef } from "react";

/**
 * A React hook for debouncing a value with maximum performance.
 *
 * @param {T} value - The value to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {T} - The debounced value.
 *
 * @example
 * ```
 * import { useState } from 'react';
 * 
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebouncer(searchTerm, 300);
 *
 * return (
 *   <div>
 *     <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
 *     <p>Debounced Value: {debouncedSearchTerm}</p>
 *   </div>
 * );
 * ```
 */
export function useDebouncer<T = string>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [value, delay]);

    return debouncedValue;
}