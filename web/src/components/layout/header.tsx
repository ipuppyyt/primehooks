import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Moon, Sun, Github } from 'lucide-react'
import { AnimatePresence, motion } from "framer-motion"
import { repoURL } from '../../../../package.json'
import { Link, useLocation } from 'react-router'
import { Button } from '@/components/ui/button'
import { SearchCommand } from '../molecules'
import { SearchButton } from '../atoms'
import { useTheme } from '@/providers'
import { Sidebar } from './sidebar'
import { useState } from 'react'

export function Header() {
    const [searchOpen, setSearchOpen] = useState<boolean>(false);
    const { isDarkMode, toggleDarkMode } = useTheme();
    const { pathname } = useLocation()

    return (
        <main className='mx-auto max-w-screen-2xl'>
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 md:h-18 items-center">
                    <div className="mr-4 flex md:mr-6">
                        {pathname !== '/' && (
                            <Sheet>
                                <SheetTrigger asChild className="md:hidden">
                                    <Button variant="ghost" size="icon">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[300px] p-0">
                                    <Sidebar />
                                </SheetContent>
                            </Sheet>
                        )}

                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2">
                            <span className="font-bold text-xl">Primehooks</span>
                        </Link>
                    </div>

                    {/* Search */}
                    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                        <div className="w-full flex flex-1 md:w-auto md:flex-none justify-end space-x-3">
                            <AnimatePresence mode="wait">
                                {pathname.startsWith("/docs") && (
                                    <motion.div
                                        key="docs-header"
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{ duration: 0.25 }}
                                        className="flex items-center gap-2"
                                    >
                                        <SearchButton
                                            className="hidden md:flex"
                                            onClick={() => setSearchOpen(true)}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </div>


                        <nav className="hidden md:flex items-center space-x-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleDarkMode}
                                aria-label="Toggle theme"
                            >
                                {!isDarkMode ? (
                                    <Sun className="h-5 w-5" />
                                ) : (
                                    <Moon className="h-5 w-5" />
                                )}
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                                <a
                                    href={repoURL}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="GitHub repository"
                                >
                                    <Github className="h-5 w-5" />
                                </a>
                            </Button>
                        </nav>
                    </div>
                </div>
            </header>

            <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
        </main>
    );
}
