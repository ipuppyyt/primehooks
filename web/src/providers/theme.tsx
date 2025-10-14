import { useLocalStorage } from '@/hooks';
import { flushSync } from 'react-dom';
import {
    createContext,
    useContext,
    useEffect,
    type ReactNode,
    type MouseEvent,
} from 'react';

interface ThemeContextType {
    isDarkMode: boolean;
    toggleDarkMode: (event: MouseEvent<HTMLButtonElement>) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
    initialTheme?: 'light' | 'dark';
    storageKey?: string;
}

function getSystemPrefersDark(defaultTheme: 'light' | 'dark') {
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : defaultTheme;
    }
    return defaultTheme;
}

export function ThemeProvider({
    children,
    initialTheme = 'light',
    storageKey = 'theme',
}: ThemeProviderProps) {
    const systemDefault = getSystemPrefersDark(initialTheme);
    const [theme, setTheme] = useLocalStorage<'light' | 'dark'>(storageKey, systemDefault);

    const isDarkMode = theme === 'dark';

    useEffect(() => {
        document.documentElement.style.viewTransitionName = 'theme';
    }, []);

    useEffect(() => {
        const root = document.documentElement;

        if (isDarkMode) {
            root.setAttribute('data-theme', 'dark');
            root.classList.add('dark');
        } else {
            root.setAttribute('data-theme', 'light');
            root.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleDarkMode = async () => {
        const nextTheme: 'light' | 'dark' = isDarkMode ? 'light' : 'dark';

        if (!document.startViewTransition) {
            setTheme(nextTheme);
            return;
        }

        document.startViewTransition(() => {
            flushSync(() => {
                setTheme(nextTheme);
            });
        });
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            <div className="relative min-h-screen overflow-hidden font-figtree">
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