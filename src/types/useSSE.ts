/**
 * Options for configuring the SSE connection.
 */
export interface SSEOptions {
    /** Whether to send credentials (cookies) with the request. Default: false */
    withCredentials?: boolean;
    /** Event type to listen for. Default: "message" */
    eventType?: string;
    /** Whether to automatically reconnect on error/disconnect. Default: false */
    autoReconnect?: boolean;
    /** Time in milliseconds to wait before auto-reconnect. Default: 3000 */
    reconnectInterval?: number;
    /** Number of auto-reconnect attempts before giving up. Default: 10 */
    reconnectAttempts?: number;
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
    data: T | undefined;
    /** The most recent error event, if any */
    error: Error | null;
    /** Number of remaining reconnect attempts, if autoReconnect is enabled */
    retriesLeft: number | undefined;
    /** Whether the last reconnect attempt timed out */
    reconnectTimedOut: boolean;
    /** Function to manually close the SSE connection */
    close: () => void;
    /** Function to manually reconnect to the SSE stream */
    reconnect: () => void;
}