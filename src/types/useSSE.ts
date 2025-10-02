/**
 * Options for configuring the SSE connection.
 */
export interface SSEOptions {
    /** Whether to send credentials (cookies) with the request. Default: false */
    withCredentials?: boolean;
    /** List of event types to listen for. Default: ["message"] */
    eventTypes?: string[];
    /** Whether to automatically reconnect on error/disconnect. Default: false */
    autoReconnect?: boolean;
    /** Time in milliseconds to wait before auto-reconnect. Default: 3000 */
    reconnectInterval?: number;
    /** Callback invoked when the connection opens */
    onOpen?: (event: Event) => void;
    /** Callback invoked when an error occurs */
    onError?: (event: Event) => void;
}

/**
 * Return value from the useSSE hook.
 * @template T - The expected type of data received from the SSE stream
 */
export interface UseSSEResult<T> {
    /** Whether the SSE connection is currently open */
    isConnected: boolean;
    /** The most recent data received from the SSE stream, parsed as type T */
    data?: T;
    /** The most recent error event, if any */
    error?: Event | null;
    /** Function to manually close the SSE connection */
    close: () => void;
    /** Function to manually reconnect to the SSE stream */
    reconnect: () => void;
}