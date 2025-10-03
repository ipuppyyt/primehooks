import { createContext, useContext, useEffect, useState, type ReactNode, type MouseEvent } from 'react';
import { usePrefersTheme } from 'react-haiku';
import { flushSync } from 'react-dom';


interface ThemeContextType {
    isDarkMode: boolean;
    toggleDarkMode: (event: MouseEvent<HTMLButtonElement>) => Promise<void>;
}


const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


interface ThemeProviderProps {
    children: ReactNode;
    initialTheme?: 'light' | 'dark';
}


export function ThemeProvider({ children, initialTheme = 'light' }: ThemeProviderProps) {
    const preferredTheme = usePrefersTheme(initialTheme);
    const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);


    useEffect(() => {
        const savedTheme = document.cookie.split('; ').find(row => row.startsWith('theme='));
        setIsDarkMode(savedTheme ? savedTheme.split('=')[1] === 'dark' : preferredTheme === 'dark');
    }, [preferredTheme]);


    useEffect(() => {
        if (isDarkMode === null) return;


        document.documentElement.classList.add('transition-colors', 'duration-300', 'ease-in-out');


        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.documentElement.classList.add('dark');
            document.cookie = 'theme=dark; path=/; max-age=31536000; SameSite=Strict; Secure;';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            document.documentElement.classList.remove('dark');
            document.cookie = 'theme=light; path=/; max-age=31536000; SameSite=Strict; Secure;';
        }
    }, [isDarkMode]);


    const toggleDarkMode = async () => {
        if (!document.startViewTransition) {
            setIsDarkMode((prev) => !prev);
            return;
        }


        const newIsDarkMode = !isDarkMode;
        document.cookie = `theme=${newIsDarkMode ? 'dark' : 'light'}; path=/; max-age=31536000; SameSite=Strict; Secure;`;


        // Simple fade transition - let the View Transition API handle it
        document.startViewTransition(() => {
            flushSync(() => {
                setIsDarkMode(newIsDarkMode);
            });
        });
    };


    if (isDarkMode === null) return null;


    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            <div className="relative min-h-screen overflow-hidden transition-colors duration-300 ease-in-out font-figtree">
                {children}
            </div>
        </ThemeContext.Provider>
    );
}


// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
