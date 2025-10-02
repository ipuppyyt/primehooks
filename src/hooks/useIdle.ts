import { useState, useEffect, useRef } from 'react';

/**
 * A React hook for detecting user idle state based on inactivity.
 * 
 * @param idleTimeout - The duration of inactivity (in milliseconds) before considering the user idle.
 * @returns A boolean indicating whether the user is currently active or idle. Returns `true` if the user is active, and `false` if the user is idle.
 * 
 * @example
 * ```
 * const isOnline = useIdle(3000); // User is considered idle after 3 seconds of inactivity
 * 
 * return (
 *   <div>
 *     {isOnline ? "User is active" : "User is idle"}
 *   </div>
 * );
 * ```
 */

export function useIdle(idleTimeout: number = 5000): boolean {
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

    return isOnline;
}
