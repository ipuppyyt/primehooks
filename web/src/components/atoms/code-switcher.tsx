import { useState, useEffect, useMemo } from 'react'
import * as Babel from '@babel/standalone'
import { useLanguage } from '@/providers'
import { CodeBlock } from './code-block'

interface CodeSwitcherProps {
    children: string;
    filename?: string;
    highlightLines?: number[];
    autoConvert?: boolean;
    switcher?: boolean;
}

export function CodeSwitcher({
    children,
    filename,
    highlightLines = [],
    autoConvert = true,
    switcher = true
}: CodeSwitcherProps) {
    const [jsCode, setJsCode] = useState<string>('');
    const { activeLanguage } = useLanguage();

    useEffect(() => {
        if (!switcher) return;

        if (autoConvert && activeLanguage === 'js') {
            try {
                const result = Babel.transform(children, {
                    presets: [
                        ['typescript', {
                            isTSX: true,
                            allExtensions: true,
                            onlyRemoveTypeImports: true,
                        }]
                    ],
                    plugins: [],
                    filename: filename || 'source.tsx',
                    retainLines: true,
                    compact: false,
                    comments: true,
                    minified: false,
                    generatorOpts: {
                        retainLines: true,
                        compact: false,
                        concise: false,
                        comments: true,
                    }
                });

                let cleanedCode = result.code || children;
                cleanedCode = cleanedCode.replace(/^["']use strict["'];\n?/, '');
                cleanedCode = cleanedCode.replace(/^\n{3,}/, '\n\n');

                setJsCode(cleanedCode);
            } catch (error) {
                console.error('Failed to convert TypeScript to JavaScript:', error);
                setJsCode(children);
            }
        }
    }, [children, activeLanguage, autoConvert, filename, switcher]);

    const displayLanguage = useMemo(() => {
        if (!switcher) return 'typescript';
        return activeLanguage === 'ts' ? 'typescript' : 'javascript';
    }, [switcher, activeLanguage]);

    const displayCode = useMemo(() => {
        if (!switcher) return children;
        return activeLanguage === 'ts' ? children : jsCode;
    }, [switcher, children, activeLanguage, jsCode]);

    const displayFilename = useMemo(() => {
        if (!switcher) return filename;
        return filename
            ? filename.replace(/\.(js|ts|jsx|tsx)$/, `.${activeLanguage}${filename.includes('x') ? 'x' : ''}`)
            : undefined;
    }, [switcher, filename, activeLanguage]);

    const format = useMemo(() => {
        return switcher ? true : false;
    }, [switcher]);

    return (
        <CodeBlock
            language={displayLanguage}
            filename={displayFilename}
            highlightLines={highlightLines}
            format={format}
            switcher={switcher}
        >
            {displayCode}
        </CodeBlock>
    );
}