/**
 * Configuration options for the useFetch hook.
 * Extends the native RequestInit interface with additional custom options.
 *
 * @template T - The expected response data type.
 */
export interface UseFetchOptions<T = unknown> extends Omit<RequestInit, 'body'> {
    /**
     * Custom headers to include in the request.
     * @default {}
     */
    headers?: HeadersInit;

    /**
     * The request method (GET, POST, PUT, DELETE, PATCH, etc.).
     * @default "GET"
     */
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";

    /**
     * The request body. Can be a string, FormData, Blob, or object that will be JSON stringified.
     */
    body?: BodyInit | Record<string, unknown>;

    /**
     * Custom response parser function. If not provided, will attempt to parse as JSON.
     * @param response - The fetch Response object.
     * @returns The parsed data of type T.
     */
    parser?: (response: Response) => Promise<T>;

    /**
     * Timeout in milliseconds. Request will be aborted if it exceeds this duration.
     */
    timeout?: number;

    /**
     * Whether to automatically parse JSON responses.
     * @default true
     */
    parseJson?: boolean;

    /**
     * Base URL to prepend to the provided url parameter.
     */
    baseURL?: string;

    /**
     * Query parameters to append to the URL.
     */
    params?: Record<string, string | number | boolean>;

    /**
     * Function to validate the response before parsing.
     * Throw an error if validation fails.
     */
    validateResponse?: (response: Response) => void | Promise<void>;
}


/**
 * Represents a successful result with data and no error.
 * @template T - The type of the successful data.
 */
type FetchSuccessResult<T> = {
    readonly data: T;
    readonly error: null;
    readonly loading: false;
};

/**
 * Represents an error result with no data.
 * @template E - The type of the error (defaults to Error).
 */
type FetchErrorResult<E = Error> = {
    readonly data: null;
    readonly error: E;
    readonly loading: false;
};

/**
 * A discriminated union representing either a successful result or an error result.
 * This follows the Result pattern for type-safe error handling.
 * 
 * @template T - The type of the successful data.
 * @template E - The type of the error (defaults to Error).
 */
export type FetchResult<T, E = Error> = FetchSuccessResult<T> | FetchErrorResult<E>;