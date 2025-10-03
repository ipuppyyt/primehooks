import { Routes, Route } from 'react-router'
import { Sidebar } from './sidebar'
import { DocsPage } from '@/pages'
import { Header } from './header'

export function DocsLayout() {
    return (
        <div className="min-h-screen mx-auto max-w-screen-2xl">
            <Header />
            <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
                {/* Sidebar - hidden on mobile */}
                <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
                    <Sidebar />
                </aside>

                {/* Main content area */}
                <main className="relative py-6 lg:gap-10 lg:py-8">
                    <div className="mx-auto w-full min-w-0">
                        <Routes>
                            <Route path=":category/:slug" element={<DocsPage />} />
                            <Route path=":slug" element={<DocsPage />} />
                            <Route path="/" element={<DocsPage />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </div>
    );
}
