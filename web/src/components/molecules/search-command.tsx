import { searchDocs, type SearchResult } from '@/lib/search-index'
import { useEffect, useState, useCallback } from 'react'
import { FileText, BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useDebounce } from '@/hooks'
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'

interface SearchCommandProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        if (debouncedQuery) {
            const searchResults = searchDocs(debouncedQuery);
            setResults(searchResults);
        } else {
            setResults([]);
        }
    }, [debouncedQuery]);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onOpenChange(!open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, [open, onOpenChange]);

    const handleSelect = useCallback(
        (url: string) => {
            onOpenChange(false);
            navigate(url);
            setQuery('');
        },
        [navigate, onOpenChange]
    );

    const groupedResults = results.reduce((acc, result) => {
        if (!acc[result.category]) {
            acc[result.category] = [];
        }
        acc[result.category].push(result);
        return acc;
    }, {} as Record<string, SearchResult[]>);

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Hooks':
                return <FileText className="mr-2 h-4 w-4" />;
            case 'Getting Started':
                return <BookOpen className="mr-2 h-4 w-4" />;
            default:
                return <FileText className="mr-2 h-4 w-4" />;
        }
    };

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange}>
            <CommandInput
                placeholder="Search documentation..."
                value={query}
                onValueChange={setQuery}
            />
            <CommandList>
                <CommandEmpty>
                    {query ? 'No results found.' : 'Start typing to search...'}
                </CommandEmpty>
                {Object.entries(groupedResults).map(([category, items]) => (
                    <CommandGroup key={category} heading={category}>
                        {items.map((item) => (
                            <CommandItem
                                key={item.url}
                                value={item.title}
                                onSelect={() => handleSelect(item.url)}
                            >
                                {getCategoryIcon(category)}
                                <div className="flex flex-col">
                                    <span className="font-medium">{item.title}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {item.description}
                                    </span>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                ))}
            </CommandList>
        </CommandDialog>
    );
}
