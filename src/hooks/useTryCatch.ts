import { TryCatchResult } from "../types";

/**
* A utility function that wraps a Promise in a try/catch block and returns a standardized result object with loading state.
 *
 * This helper is useful for handling asynchronous operations without the need for explicit try/catch blocks.
 * It returns an object `{ data, error, loading }` where `data` is the resolved value (if successful), 
 * `error` is the caught error (if any), and `loading` is a boolean that tracks the promise state.
 *
 * @template T - The expected resolved type of the Promise.
 * @template E - The expected error type (defaults to `Error`).
 *
 * @param {Promise<T>} promise - The promise to execute and handle.
 * @returns {Promise<TryCatchResult<T, E>>} A promise that resolves to an object with `data`, `error`, and `loading` properties.
 *
 * @example
 * Basic usage with loading state tracking.
 * ```ts
 * 
 * interface ExampleData {
 *  name: string;
 *  age: number;
 * }
 * 
 * const { data, error, loading } = await useTryCatch<ExampleData>(
 *   fetch("https://api.example.com/data").then(r => r.json())
 * );
 *
 * console.log("Is loading:", loading); // false (promise resolved)
 *
 * if (error) {
 *   console.error("Request failed:", error);
 *   return;
 * }
 *
 * console.log("Data:", data);
 * ```
 */

export async function useTryCatch<T, E = Error>(
    promise: Promise<T>
): Promise<TryCatchResult<T, E>> {
    let loading: boolean = true;
    try {
        const data = await promise;
        loading = false;
        return { data, error: null, loading };
    } catch (error) {
        loading = false;
        return { data: null, error: error as E, loading };
    }
}