/// <reference types="vite/client" />

declare module 'virtual:search-index' {
    export interface SearchResult {
        title: string;
        description: string;
        url: string;
        category: string;
    }

    export const searchIndex: SearchResult[];
    export function searchDocs(query: string): SearchResult[];
}

declare module 'virtual:navigation' {
    export interface NavItem {
        title: string;
        href: string;
        items?: NavItem[];
    }

    export const sidebarNav: NavItem[];
}