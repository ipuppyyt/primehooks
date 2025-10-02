import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { SSEOptions, UseSSEResult } from "../types";

/**
 * A React hook for managing Server-Sent Events (SSE) connections.
 * 
 * @template T - The expected type of data received from the SSE stream
 * @param url - The URL to connect to for SSE
 * @param options - Configuration options for the SSE connection. Has an export for type 'SSEOptions'.
 * @returns An object containing connection status, received data, error information, and control functions
 * 
 * @example
 * ```
 * // Define the expected data shape
 * interface MyEventData {
 *   id: string;
 *   value: number;
 * }
 * 
 * // Use the hook in a component
 * const { isConnected, data, error, reconnectTimedOut, retriesLeft, close, reconnect } = useSSE<MyEventData>(
 *   "https://example.com/sse-endpoint",
 *   {
 *     withCredentials: false,
 *     eventType: "message",
 *     autoReconnect: true,
 *     reconnectInterval: 4000,
 *     reconnectAttempts: 5,
 *     onOpen: (event) => console.log("Connection opened:", event),
 *     onError: (event) => console.error("Connection error:", event),
 *   }
 * );
 * ```
 */
export function useSSE<T = unknown>(
    url: string,
    options: SSEOptions = {}
): UseSSEResult<T> {
    const {
        withCredentials = false,
        eventType = "message",
        autoReconnect = false,
        reconnectInterval = 3000,
        reconnectAttempts = 10,
        onOpen,
        onError,
    } = options;

    const [isConnected, setIsConnected] = useState(false);
    const [data, setData] = useState<T>();
    const [error, setError] = useState<Error | null>(null);
    const [reconnectTrigger, setReconnectTrigger] = useState(0);
    const [reconnectTimedOut, setReconnectTimedOut] = useState(false);
    const [retriesLeft, setRetriesLeft] = useState<number | undefined>(reconnectAttempts);

    const retriesLeftRef = useRef(reconnectAttempts);
    const eventSourceRef = useRef<EventSource | null>(null);
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const manualCloseRef = useRef(false);
    const isInitialMount = useRef(true);

    const onOpenRef = useRef(onOpen);
    const onErrorRef = useRef(onError);

    useEffect(() => {
        onOpenRef.current = onOpen;
        onErrorRef.current = onError;
    }, [onOpen, onError]);

    const clearReconnectTimeout = () => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
    };

    const close = useCallback(() => {
        manualCloseRef.current = true;
        clearReconnectTimeout();
        setRetriesLeft(undefined);
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
            setIsConnected(false);
        }
    }, []);

    const reconnect = useCallback(() => {
        manualCloseRef.current = false;
        isInitialMount.current = false;
        clearReconnectTimeout();
        setReconnectTimedOut(false);
        retriesLeftRef.current = reconnectAttempts;
        setRetriesLeft(reconnectAttempts);
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
        setError(null);
        setData(undefined);
        setIsConnected(false);
        setReconnectTrigger(prev => prev + 1);
    }, [reconnectAttempts]);

    useEffect(() => {
        if (!url) return;

        if (isInitialMount.current) {
            retriesLeftRef.current = reconnectAttempts;
            setRetriesLeft(reconnectAttempts);
            isInitialMount.current = false;
        }

        const wasManualClose = manualCloseRef.current;
        manualCloseRef.current = false;

        if (!wasManualClose) {
            setReconnectTimedOut(false);
        }

        const es = new EventSource(url, { withCredentials });
        eventSourceRef.current = es;

        es.onopen = (event) => {
            setIsConnected(true);
            setError(null);
            setReconnectTimedOut(false);
            onOpenRef.current?.(event);
        };

        es.onerror = (event) => {
            setIsConnected(false);

            if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
                setError(new Error("URL not accessible"));
            } else {
                setError(new Error("Connection error"));
            }

            onErrorRef.current?.(event);

            if (
                autoReconnect &&
                !manualCloseRef.current &&
                retriesLeftRef.current > 0
            ) {
                retriesLeftRef.current -= 1;
                setRetriesLeft(retriesLeftRef.current);

                if (retriesLeftRef.current === 0) {
                    setReconnectTimedOut(true);
                } else {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        setReconnectTrigger(prev => prev + 1);
                    }, reconnectInterval);
                }
            } else if (retriesLeftRef.current === 0) {
                setReconnectTimedOut(true);
            }
        };

        const handler: EventListener = (event) => {
            if (event instanceof MessageEvent) {
                try {
                    setData(JSON.parse(event.data) as T);
                } catch {
                    setData(undefined);
                }
            } else {
                setData(undefined);
            }
        };

        es.addEventListener(eventType, handler);

        return () => {
            clearReconnectTimeout();
            if (eventSourceRef.current) {
                eventSourceRef.current.removeEventListener(eventType, handler);
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
            setIsConnected(false);
        };
    }, [
        url,
        withCredentials,
        eventType,
        reconnectTrigger,
        autoReconnect,
        reconnectInterval,
        reconnectAttempts,
    ]);

    return { isConnected, data, error, reconnectTimedOut, retriesLeft, close, reconnect };
}
