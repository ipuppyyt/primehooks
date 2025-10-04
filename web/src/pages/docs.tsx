import { useEffect, useMemo, useState, type ComponentType } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';

// Load MDX modules lazily
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mdxFiles = import.meta.glob<any>('../../../docs/**/*.mdx', { eager: false });

type DocEntry = {
    fsPath: string;
    routePath: string;
    category?: string;
    slug: string;
};

type MdxModule = {
    default: ComponentType;
    frontmatter?: { title?: string };
    meta?: { title?: string }; // for manual export pattern
};

const stripPrefix = (p: string) => {
    const i = p.lastIndexOf('/docs/');
    const sliced = i >= 0 ? p.slice(i + '/docs/'.length) : p;
    return sliced.replace(/\.mdx$/, '');
};

const DOCS_INDEX: DocEntry[] = Object.keys(mdxFiles).map((fsPath) => {
    const trimmed = stripPrefix(fsPath);
    const parts = trimmed.split('/');
    if (parts.length === 1) {
        const slug = parts[0];
        return { fsPath, routePath: `/docs/${slug}`, slug };
    }
    const [category, slug] = parts.slice(-2);
    return { fsPath, routePath: `/docs/${category}/${slug}`, category, slug };
});

const findFirstInCategory = (category: string): DocEntry | undefined =>
    DOCS_INDEX.filter(e => e.category === category)
        .sort((a, b) => a.slug.localeCompare(b.slug))[0];

const resolveEntryFromParams = (category?: string, slug?: string): DocEntry | undefined => {
    if (category && slug) return DOCS_INDEX.find(e => e.category === category && e.slug === slug);
    if (!category && slug) return DOCS_INDEX.find(e => !e.category && e.slug === slug);
    if (!category && !slug) {
        return (
            DOCS_INDEX.find(e => e.routePath === '/docs/introduction') ??
            DOCS_INDEX.find(e => !e.category) ??
            DOCS_INDEX[0]
        );
    }
    return undefined;
};

const slugToLabel = (text: string) =>
    text.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

export function DocsPage() {
    const { category, slug } = useParams<{ category?: string; slug?: string }>();
    const navigate = useNavigate();

    const [MdxComponent, setMdxComponent] = useState<ComponentType | null>(null);
    const [pageTitle, setPageTitle] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Redirect /docs/:category -> first item in category
    useEffect(() => {
        if (category && !slug) {
            const first = findFirstInCategory(category);
            if (first) {
                navigate(first.routePath, { replace: true });
            } else {
                setError(`No documentation found in category: ${category}`);
                setLoading(false);
            }
        }
    }, [category, slug, navigate]);

    const currentEntry = useMemo(() => {
        if (category && !slug) return undefined;
        return resolveEntryFromParams(category, slug);
    }, [category, slug]);

    useEffect(() => {
        const load = async () => {
            if (category && !slug) return; // waiting for redirect
            setLoading(true);
            setError(null);
            setMdxComponent(null);
            setPageTitle(null);

            try {
                const entry = currentEntry;
                if (!entry) throw new Error('Documentation not found');

                const loader = mdxFiles[entry.fsPath] as () => Promise<MdxModule>;
                if (!loader) throw new Error('Documentation not found');

                const mod = await loader();

                // Set component
                setMdxComponent(() => mod.default);

                // Prefer YAML frontmatter (via remark-frontmatter + remark-mdx-frontmatter),
                // otherwise fall back to a manual `export const meta = { title }`
                const title =
                    mod.frontmatter?.title ||
                    mod.meta?.title ||
                    slugToLabel(entry.slug);

                setPageTitle(title);
            } catch (err) {
                console.error('Load error:', err);
                setError(err instanceof Error ? err.message : 'Failed to load documentation');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [category, slug, currentEntry]);

    if (category && !slug) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-4 w-full" />
            </div>
        );
    }

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                <h2 className="text-lg font-semibold text-destructive">Error</h2>
                <p className="text-sm text-muted-foreground">{error}</p>
            </div>
        );
    }

    if (!MdxComponent) return null;

    return (
        <div className="space-y-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbSeparator />

                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/docs">Docs</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>

                    {category && (
                        <>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link to={`/docs/${category}`}>
                                        {slugToLabel(category)}
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </>
                    )}

                    {(slug || pageTitle) && (
                        <>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    {pageTitle ?? (slug ? slugToLabel(slug) : '')}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </>
                    )}
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex-1 min-h-0">
                <ScrollArea className="h-[calc(100vh-10rem)]">
                    <div className="markdown-content">
                        <MdxComponent />
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
