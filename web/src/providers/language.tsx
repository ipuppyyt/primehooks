import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const languages = [
    { name: 'TypeScript', abbr: 'TS', value: 'ts' },
    { name: 'JavaScript', abbr: 'JS', value: 'js' },
]

export type Languages = 'js' | 'ts';

interface LanguageVariants {
    name: string;
    abbr: string;
    value: string
}

interface LanguageContextType {
    languages: LanguageVariants[]
    activeLanguage: Languages;
    setActiveLanguage: (lang: Languages) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
    const [activeLanguage, setActiveLanguage] = useLocalStorage<Languages>('preferred-language', 'ts');

    return (
        <LanguageContext.Provider value={{ languages, activeLanguage, setActiveLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}