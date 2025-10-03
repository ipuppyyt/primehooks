import { vscDarkPlus, gruvboxLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import parserTypescript from 'prettier/plugins/typescript';
import parserMarkdown from 'prettier/plugins/markdown';
import parserEstree from 'prettier/plugins/estree';
import parserCss from 'prettier/plugins/postcss';
import parserBabel from 'prettier/plugins/babel';
import { Button } from '@/components/ui/button';
import parserHtml from 'prettier/plugins/html';
import { useState, useEffect, type ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';
import prettier from 'prettier/standalone';
import { useLanguage, useTheme } from '@/providers';

interface CodeBlockProps {
    children: ReactNode;
    language?: string;
    filename?: string;
    highlightLines?: number[];
    format?: boolean;
}

const languageParserMap: Record<string, string> = {
    typescript: 'typescript',
    tsx: 'typescript',
    javascript: 'babel',
    jsx: 'babel',
    js: 'babel',
    ts: 'typescript',
    json: 'json',
    html: 'html',
    css: 'css',
    scss: 'scss',
    less: 'less',
    markdown: 'markdown',
    md: 'markdown',
    bash: 'bash',
    sh: 'bash',
};

const getPlugins = (language: string) => {
    const parser = languageParserMap[language];

    if (parser === 'typescript') {
        return [parserTypescript, parserEstree];
    }
    if (parser === 'babel') {
        return [parserBabel, parserEstree];
    }
    if (parser === 'html') {
        return [parserHtml];
    }
    if (parser === 'css' || parser === 'scss' || parser === 'less') {
        return [parserCss];
    }
    if (parser === 'markdown') {
        return [parserMarkdown];
    }

    return [parserBabel, parserEstree];
};

export function CodeBlock({
    children,
    language = 'typescript',
    filename,
    highlightLines = [],
    format = true,
}: CodeBlockProps) {
    const [copied, setCopied] = useState<boolean>(false);
    const { activeLanguage, setActiveLanguage } = useLanguage();
    const { isDarkMode } = useTheme();

    const extractCode = (node: ReactNode): string => {
        if (typeof node === 'string') {
            return node;
        }
        if (typeof node === 'number') {
            return String(node);
        }
        if (Array.isArray(node)) {
            return node.map(extractCode).join('');
        }
        if (node && typeof node === 'object' && 'props' in node) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return extractCode((node as any).props.children);
        }
        return '';
    };

    const code = extractCode(children).trim();
    const [formattedCode, setFormattedCode] = useState<string>(code);

    useEffect(() => {
        async function formatCode() {
            if (!format) {
                setFormattedCode(code);
                return;
            }

            try {
                const parser = languageParserMap[language.toLowerCase()];

                if (!parser || parser === 'bash') {
                    setFormattedCode(code);
                    return;
                }

                if (parser) {
                    const formatted = await prettier.format(code, {
                        parser,
                        plugins: getPlugins(language.toLowerCase()),
                        semi: true,
                        singleQuote: true,
                        tabWidth: 2,
                        trailingComma: 'es5',
                        printWidth: 80,
                    });
                    setFormattedCode(formatted.trim());
                } else {
                    setFormattedCode(code);
                }
            } catch (error) {
                console.warn('Failed to format code:', error);
                setFormattedCode(code);
            }
        }

        formatCode();
    }, [code, language, format]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(formattedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative my-6 rounded-lg border bg-zinc-200 dark:bg-zinc-950 overflow-hidden">
            {filename && (
                <div className="flex items-center justify-between border-b border-zinc-400 dark:border-zinc-800 px-4 py-2 bg-zinc-200 dark:bg-zinc-900">
                    <span className='text-sm text-zinc-700 dark:text-zinc-400'>{filename}</span>

                    <div className="border border-zinc-800 dark:border-zinc-600 rounded-md">
                        <Button
                            size="sm"
                            variant={activeLanguage === 'js' ? 'default' : 'ghost'}
                            onClick={() => setActiveLanguage('js')}
                            className="h-7 px-3 text-xs rounded-r-none"
                        >
                            JS
                        </Button>
                        <Button
                            size="sm"
                            variant={activeLanguage === 'ts' ? 'default' : 'ghost'}
                            onClick={() => setActiveLanguage('ts')}
                            className="h-7 px-3 text-xs rounded-l-none"
                        >
                            TS
                        </Button>
                    </div>
                </div>
            )}
            <div className="relative">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 h-8 w-8 z-10 hover:bg-zinc-800"
                    onClick={copyToClipboard}
                >
                    {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                    ) : (
                        <Copy className="h-4 w-4 text-zinc-400" />
                    )}
                </Button>
                
                <SyntaxHighlighter
                    language={language}
                    style={!isDarkMode ? gruvboxLight : vscDarkPlus}
                    customStyle={{
                        margin: 0,
                        padding: '1rem',
                        background: 'transparent',
                        fontSize: '0.875rem',
                    }}
                    wrapLines={true}
                    lineProps={(lineNumber) => ({
                        style: {
                            backgroundColor: highlightLines.includes(lineNumber)
                                ? 'rgba(255, 255, 255, 0.1)'
                                : 'transparent',
                            display: 'block',
                            width: '100%',
                        },
                    })}
                    showLineNumbers={false}
                >
                    {formattedCode}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}
