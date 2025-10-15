import { FetchResult, UseFetchOptions } from "../types";


/**
 * A utility function that wraps the Fetch API in a try/catch block and returns a standardized result object with loading state.
 *
 * This helper is useful for handling HTTP requests without the need for explicit try/catch blocks.
 * It returns an object `{ data, error, loading }` where `data` is the resolved value (if successful),
 * `error` is the caught error (if any), and `loading` is a boolean that tracks the request state.
 *
 * @template T - The expected response data type.
 * @template E - The expected error type (defaults to `Error`).
 *
 * @param {string} url - The URL to fetch from.
 * @param {UseFetchOptions<T>} [options] - Optional fetch configuration and custom options.
 * @returns {Promise<FetchResult<T, E>>} A promise that resolves to an object with `data`, `error`, and `loading` properties.
 *
 * @example
 * Basic GET request with type safety
 * ```ts
 * interface User {
 *   id: number;
 *   name: string;
 *   email: string;
 * }
 *
 * const { data, error, loading } = await useFetch<User>(
 *   "https://api.example.com/users/1"
 * );
 *
 * if (error) {
 *   console.error("Request failed:", error);
 *   return;
 * }
 *
 * console.log("User:", data); // TypeScript knows data is User | null
 * console.log("Loading:", loading); // false
 * ```
 *
 * @example
 * POST request with JSON body
 * ```ts
 * interface CreateUserPayload {
 *   name: string;
 *   email: string;
 * }
 *
 * interface CreateUserResponse {
 *   id: number;
 *   name: string;
 *   email: string;
 *   createdAt: string;
 * }
 *
 * const payload: CreateUserPayload = {
 *   name: "John Doe",
 *   email: "john@example.com"
 * };
 *
 * const { data, error, loading } = await useFetch<CreateUserResponse>(
 *   "https://api.example.com/users",
 *   {
 *     method: "POST",
 *     headers: {
 *       "Content-Type": "application/json",
 *     },
 *     body: payload, // Automatically stringified
 *   }
 * );
 *
 * if (error) {
 *   console.error("Failed to create user:", error);
 *   return;
 * }
 *
 * console.log("Created user:", data);
 * ```
 *
 * @example
 * With query parameters and base URL
 * ```ts
 * interface SearchResults {
 *   results: Array<{ id: number; title: string }>;
 *   total: number;
 * }
 *
 * const { data, error, loading } = await useFetch<SearchResults>(
 *   "/search",
 *   {
 *     baseURL: "https://api.example.com",
 *     params: {
 *       q: "javascript",
 *       limit: 10,
 *       offset: 0
 *     }
 *   }
 * );
 * // Fetches: https://api.example.com/search?q=javascript&limit=10&offset=0
 * ```
 *
 * @example
 * With custom response parser and timeout
 * ```ts
 * const { data, error, loading } = await useFetch<string>(
 *   "https://api.example.com/data.txt",
 *   {
 *     parser: async (response) => response.text(),
 *     timeout: 5000, // 5 second timeout
 *   }
 * );
 * ```
 *
 * @example
 * With authentication and custom headers
 * ```ts
 * interface ProtectedData {
 *   secret: string;
 * }
 *
 * const { data, error, loading } = await useFetch<ProtectedData>(
 *   "https://api.example.com/protected",
 *   {
 *     headers: {
 *       "Authorization": `Bearer ${token}`,
 *       "X-Custom-Header": "value"
 *     },
 *     validateResponse: async (response) => {
 *       if (response.status === 401) {
 *         throw new Error("Unauthorized");
 *       }
 *     }
 *   }
 * );
 * ```
 *
 * @example
 * With FormData for file uploads
 * ```ts
 * const formData = new FormData();
 * formData.append("file", fileInput.files);
 * formData.append("description", "My file");
 *
 * interface UploadResponse {
 *   fileId: string;
 *   url: string;
 * }
 *
 * const { data, error, loading } = await useFetch<UploadResponse>(
 *   "https://api.example.com/upload",
 *   {
 *     method: "POST",
 *     body: formData, // No need to set Content-Type, browser handles it
 *   }
 * );
 * ```
 */

export async function useFetch<T, E = Error>(
    url: string,
    options?: UseFetchOptions<T>
): Promise<FetchResult<T, E>> {
    let loading: boolean = true;

    try {
        // Extract custom options
        const {
            parser,
            timeout,
            parseJson = true,
            baseURL,
            params,
            validateResponse,
            body,
            headers,
            ...fetchOptions
        } = options || {};

        // Build the full URL
        let fullUrl = baseURL ? `${baseURL}${url}` : url;

        // Append query parameters
        if (params && Object.keys(params).length > 0) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                searchParams.append(key, String(value));
            });
            fullUrl += `${fullUrl.includes("?") ? "&" : "?"}${searchParams.toString()}`;
        }

        // Setup abort controller for timeout
        const controller = new AbortController();
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        if (timeout) {
            timeoutId = setTimeout(() => controller.abort(), timeout);
        }

        // Prepare request body
        let processedBody: BodyInit | undefined;
        let processedHeaders: HeadersInit | undefined = headers;

        if (body) {
            if (
                typeof body === "object" &&
                !(body instanceof FormData) &&
                !(body instanceof Blob) &&
                !(body instanceof ArrayBuffer) &&
                !(body instanceof URLSearchParams)
            ) {
                // Convert plain objects to JSON
                processedBody = JSON.stringify(body);
                processedHeaders = {
                    "Content-Type": "application/json",
                    ...headers,
                };
            } else {
                processedBody = body as BodyInit;
            }
        }

        // Make the fetch request
        const response = await fetch(fullUrl, {
            ...fetchOptions,
            headers: processedHeaders,
            body: processedBody,
            signal: controller.signal,
        });

        // Clear timeout if set
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // Validate response if validator provided
        if (validateResponse) {
            await validateResponse(response);
        }

        // Check for HTTP errors
        if (!response.ok) {
            throw new Error(
                `HTTP Error: ${response.status} ${response.statusText}`
            );
        }

        // Parse the response
        let data: T;
        if (parser) {
            data = await parser(response);
        } else if (parseJson) {
            data = await response.json();
        } else {
            data = (await response.text()) as unknown as T;
        }

        loading = false;
        return { data, error: null, loading };
    } catch (error) {
        loading = false;

        // Handle specific error types
        if (error instanceof DOMException && error.name === "AbortError") {
            return {
                data: null,
                error: new Error("Request timeout") as E,
                loading,
            };
        }

        return { data: null, error: error as E, loading };
    }
}