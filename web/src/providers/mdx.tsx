/* eslint-disable @typescript-eslint/no-explicit-any */
import { CodeSwitcher } from '@/components/atoms';
import { MDXProvider as BaseMDXProvider } from '@mdx-js/react';
import { type ReactNode } from 'react';

const components = {
    h1: (props: any) => (
        <h1
            className="scroll-m-20 text-4xl font-bold tracking-tight mb-4 mt-8 border-b pb-2"
            {...props}
        />
    ),
    h2: (props: any) => (
        <h2
            className="scroll-m-20 text-3xl font-semibold tracking-tight mb-3 mt-8 border-b pb-2"
            {...props}
        />
    ),
    h3: (props: any) => (
        <h3
            className="scroll-m-20 text-2xl font-semibold tracking-tight mb-2 mt-6"
            {...props}
        />
    ),
    p: (props: any) => (
        <p className="leading-7 mb-4 text-muted-foreground" {...props} />
    ),
    a: (props: any) => (
        <a
            className="text-primary font-medium underline-offset-4 hover:underline"
            {...props}
        />
    ),
    ul: (props: any) => (
        <ul className="my-6 ml-6 list-disc space-y-2 [&>li]:mt-2" {...props} />
    ),
    ol: (props: any) => (
        <ol className="my-6 ml-6 list-decimal space-y-2 [&>li]:mt-2" {...props} />
    ),
    code: (props: any) => {
        const { className, children } = props;
        const isInline = !className;

        if (isInline) {
            return (
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                    {children}
                </code>
            );
        }

        return <code {...props} />;
    },
    pre: (props: any) => (
        <pre
            className="mb-4 mt-6 overflow-x-auto rounded-lg border bg-muted p-4"
            {...props}
        />
    ),
    table: (props: any) => (
        <div className="my-6 w-full overflow-y-auto rounded-xl">
            <table className="w-full border-collapse border border-border" {...props} />
        </div>
    ),
    th: (props: any) => (
        <th
            className="border border-border px-4 py-2 text-left font-bold bg-neutral-200 dark:bg-neutral-900"
            {...props}
        />
    ),
    td: (props: any) => (
        <td className="border border-border px-4 py-2 text-left" {...props} />
    ),
    CodeBlock: (props: any) => (
        <CodeSwitcher {...props} />
    ),
};

interface MDXProviderProps {
    children: ReactNode;
}

export function MDXProvider({ children }: MDXProviderProps) {
    return <BaseMDXProvider components={components}>{children}</BaseMDXProvider>;
}
