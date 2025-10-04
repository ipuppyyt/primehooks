import { useEffect, useRef } from "react";

/**
 * 
 * @param key - the key to normalize
 * @returns the normalized key
 * 
 * Normalizes the key to lowercase if it's a single character (a-z, A-Z).
 * Otherwise, returns the key as is.
 */
const normalizeKey = (key: string): string =>
    key.length === 1 && key.match(/[a-zA-Z]/) ? key.toLowerCase() : key;


/**
 * Checks if the active modifiers in the event match exactly the specified keys,
 * preventing extra modifiers like Shift being present when not desired.
 */
function modifiersMatch(event: KeyboardEvent, keys: string[]) {
    const modifierKeys = ["Shift", "Control", "Alt", "Meta"];
    const pressedModifiers = modifierKeys.filter(mod => event.getModifierState(mod));
    const requiredModifiers = keys.filter(k => modifierKeys.includes(k));

    if (pressedModifiers.length !== requiredModifiers.length) return false;
    return requiredModifiers.every(mod => pressedModifiers.includes(mod));
}



/**
 * A React hook that executes a callback when a specific key is pressed down.
 *
 * @param {KeyboardKey} key - The keyboard key to listen for (e.g., 'Enter', 'Escape', 'a').
 * @exports type {KeyboardKey} - The type of the keyboard key.
 * @param {() => void} callback - The function to execute when the key is pressed.
 *
 * @example
 * ```
 * import { useState } from 'react';
 * const [count, setCount] = useState(0);
 * 
 * function handleKeyDown() {
 *  setCount(prevCount => prevCount + 1);
 * }
 * 
 * useKeyDown('Enter', handleKeyDown);
 * 
 * return <div>Enter key pressed {count} times</div>;
 * ```
 */
export const useKeyDown = (key: string, callback: () => void) => {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        const normalizedKey = normalizeKey(key);
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                normalizeKey(e.key) === normalizedKey &&
                modifiersMatch(e, [normalizedKey])
            ) {
                e.preventDefault();
                callbackRef.current();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [key]);
};



/**
 * A React hook that executes a callback when a specific key is released.
 *
 * @param {KeyboardKey} key - The keyboard key to listen for (e.g., 'Shift', 'Control', 'Alt').
 * @exports type {KeyboardKey} - The type of the keyboard key.
 * @param {(event: KeyboardEvent) => void} callback - The function to execute when the key is released, receives the keyboard event.
 *
 * @example
 * ```
 * import { useState } from 'react';
 * 
 * const [lastKey, setLastKey] = useState('');
 * 
 * function handleKeyUp(event: KeyboardEvent) {
 *   setLastKey(event.key);
 *   console.log('Escape released');
 * });
 * 
 * useKeyUp('Escape', handleKeyUp);
 * 
 * return <div>Last key released: {lastKey}</div>;
 * ```
 */
export const useKeyUp = (key: string, callback: (event: KeyboardEvent) => void) => {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        const normalizedKey = normalizeKey(key);
        const handler = (event: KeyboardEvent) => {
            if (
                normalizeKey(event.key) === normalizedKey &&
                modifiersMatch(event, [normalizedKey])
            ) {
                event.preventDefault();
                callbackRef.current(event);
            }
        };

        window.addEventListener("keyup", handler);
        return () => {
            window.removeEventListener("keyup", handler);
        };
    }, [key]);
};



/**
 * A React hook that executes a callback when a specific key press event occurs.
 * Note: The 'keypress' event is deprecated. Consider using useKeyDown instead.
 *
 * @param {KeyboardKey} key - The keyboard key to listen for (e.g., 'a', 'b', '1').
 * @exports type {KeyboardKey} - The type of the keyboard key.
 * @param {() => void} callback - The function to execute when the key is pressed.
 *
 * @example
 * ```
 * import { useState } from 'react';
 * 
 * const [pressed, setPressed] = useState(false);
 * 
 * function handlePress(event: KeyboardEvent) {
 *   setPressed(true);
 *   setTimeout(() => setPressed(false), 200);
 * }
 *
 * useKeyPress('s', handlePress);
 * 
 * return <div>{pressed ? 'S pressed!' : 'Press S'}</div>;
 * ```
 */
export const useKeyPress = (key: string, callback: () => void) => {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        const normalizedKey = normalizeKey(key);
        const handleKeyPress = (e: KeyboardEvent) => {
            if (
                normalizeKey(e.key) === normalizedKey &&
                modifiersMatch(e, [normalizedKey])
            ) {
                e.preventDefault();
                callbackRef.current();
            }
        };

        window.addEventListener("keypress", handleKeyPress);
        return () => {
            window.removeEventListener("keypress", handleKeyPress);
        };
    }, [key]);
};

/**
 * A React hook that calls a callback when a specific combination of keys is pressed simultaneously.
 *
 * @param {KeyboardKey[]} keys - An array of keyboard keys that must be pressed together.
 * @param {() => void} callback - The function to execute when the key combination is detected.
 *
 * @example
 * ```
 * import { useState } from 'react';
 * 
 * const [saveCount, setSaveCount] = useState(0);
 * 
 * function handleSave() {
 *   setSaveCount(prevCount => prevCount + 1);
 * }
 * 
 * useKeyPressCombination(['Control', 's'], handleSave);
 * 
 * return <div>Save command triggered {saveCount} times</div>;
 * ```
 */
export const useKeyPressCombination = (keys: string[], callback: () => void) => {
    const pressedKeysRef = useRef<Set<string>>(new Set());
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        const normalizedKeys = keys.map(k => normalizeKey(k));

        const handleKeyDown = (event: KeyboardEvent) => {
            const key = normalizeKey(event.key);
            pressedKeysRef.current.add(key);

            const allPressed = normalizedKeys.every(k => pressedKeysRef.current.has(k));
            const noExtraKeys = pressedKeysRef.current.size === normalizedKeys.length;
            const modifiersOk = modifiersMatch(event, normalizedKeys);

            if (allPressed && noExtraKeys && modifiersOk) {
                event.preventDefault();
                callbackRef.current();
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            const key = normalizeKey(event.key);
            pressedKeysRef.current.delete(key);
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [keys]);
};