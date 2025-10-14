import { useState, useEffect, useRef } from 'react'

/**
 * A React hook for detecting user idle state based on inactivity.
 *
 * @param {number} idleTimeout - The duration of inactivity (in milliseconds) before considering the user idle.
 * @returns {isOnline: boolean, isIdle: boolean} - An object containing two booleans: 
 *   {isOnline, isIdle}. `isOnline` is `true` if the user is active, 
 *   and `isIdle` is `true` if the user is idle.
 *
 * @example
 * ```
 * const {isOnline, isIdle} = useIdle(3000); 
 * 
 * return (
 *   <div>
 *     <span>{isOnline ? "User is active" : "User is idle"}</span>
 *     <span>{isIdle ? "User is idle" : "User is active"}</span>
 *   </div>
 * );
 * ```
 */
export function useIdle(idleTimeout: number = 5000): { isOnline: boolean; isIdle: boolean; } {
    const [isOnline, setIsOnline] = useState<boolean>(true);
    const lastActivityRef = useRef<number>(Date.now());

    useEffect(() => {
        function updateActivity(): void {
            lastActivityRef.current = Date.now();
            if (!isOnline) {
                setIsOnline(true);
            }
        }

        function checkIdle(): void {
            if (Date.now() - lastActivityRef.current > idleTimeout) {
                setIsOnline(false);
            }
        }

        window.addEventListener('mousemove', updateActivity);
        window.addEventListener('keydown', updateActivity);
        window.addEventListener('scroll', updateActivity);
        window.addEventListener('mousedown', updateActivity);

        const interval = setInterval(checkIdle, 1000);

        return () => {
            window.removeEventListener('mousemove', updateActivity);
            window.removeEventListener('keydown', updateActivity);
            window.removeEventListener('scroll', updateActivity);
            window.removeEventListener('mousedown', updateActivity);
            clearInterval(interval);
        };
    }, [idleTimeout, isOnline]);

    const isIdle = !isOnline;
    return { isOnline, isIdle };
}
