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
 * const { isConnected, data, error, close, reconnect } = useSSE<MyEventData>(
 *   "https://example.com/sse-endpoint",
 *   {
 *     withCredentials: false,
 *     eventTypes: ["message", "custom-event"],
 *     autoReconnect: true,
 *     reconnectInterval: 4000,
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
        eventTypes = ["message"],
        autoReconnect = false,
        reconnectInterval = 3000,
        onOpen,
        onError,
    } = options;

    const [isConnected, setIsConnected] = useState(false);
    const [data, setData] = useState<T>();
    const [error, setError] = useState<Event | null>(null);
    const [reconnectTrigger, setReconnectTrigger] = useState(0);
    const eventSourceRef = useRef<EventSource | null>(null);
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const manualCloseRef = useRef(false);

    const onOpenRef = useRef(onOpen);
    const onErrorRef = useRef(onError);

    useEffect(() => {
        onOpenRef.current = onOpen;
        onErrorRef.current = onError;
    }, [onOpen, onError]);

    const close = useCallback(() => {
        manualCloseRef.current = true;
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
            setIsConnected(false);
        }
    }, []);

    const reconnect = useCallback(() => {
        manualCloseRef.current = false;
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
        setError(null);
        setData(undefined);
        setIsConnected(false);
        setReconnectTrigger((prev: number) => prev + 1);
    }, []);

    const eventTypesKey = useMemo(() => eventTypes.join(","), [eventTypes]);

    useEffect(() => {
        if (!url) return;

        manualCloseRef.current = false;

        const es = new EventSource(url, { withCredentials });
        eventSourceRef.current = es;

        es.onopen = (event) => {
            setIsConnected(true);
            setError(null);
            onOpenRef.current?.(event);
        };

        es.onerror = (event) => {
            setIsConnected(false);
            setError(event);
            onErrorRef.current?.(event);

            if (autoReconnect && !manualCloseRef.current) {
                reconnectTimeoutRef.current = setTimeout(() => {
                    reconnect();
                }, reconnectInterval);
            }
        };

        const parsedEventTypes = eventTypesKey.split(",");
        const listeners: Map<string, EventListener> = new Map();

        parsedEventTypes.forEach((eventType: string) => {
            const handler: EventListener = (event) => {
                if (eventType === "message" && event instanceof MessageEvent) {
                    try {
                        setData(JSON.parse(event.data) as T);
                    } catch {
                        setData(undefined);
                    }
                }
            };
            es.addEventListener(eventType, handler);
            listeners.set(eventType, handler);
        });

        return () => {
            listeners.forEach((handler, eventType) => {
                es.removeEventListener(eventType, handler);
            });
            listeners.clear();
            es.close();
            eventSourceRef.current = null;
            setIsConnected(false);
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
                reconnectTimeoutRef.current = null;
            }
        };
    }, [url, withCredentials, eventTypesKey, reconnectTrigger, autoReconnect, reconnectInterval, reconnect]);

    return { isConnected, data, error, close, reconnect };
}