/**
 * Represents a successful result with data and no error.
 * @template T - The type of the successful data.
 */
export type TryCatchSuccessResult<T> = {
    readonly data: T;
    readonly error: null;
    readonly loading: false;
};

/**
 * Represents an error result with no data.
 * @template E - The type of the error (defaults to Error).
 */
export type TryCatchErrorResult<E = Error> = {
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
export type TryCatchResult<T, E = Error> = TryCatchSuccessResult<T> | TryCatchErrorResult<E>;