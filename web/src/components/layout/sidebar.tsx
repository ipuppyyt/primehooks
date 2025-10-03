import { ScrollArea } from '@/components/ui/scroll-area'
import { sidebarNav } from 'virtual:navigation'
import { Link, useLocation } from 'react-router'
import { cn } from '@/lib/utils'

export function Sidebar() {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <ScrollArea className="h-full py-6 pl-8 pr-6 lg:py-8">
            <div className="space-y-4">
                {sidebarNav.map((section) => (
                    <div key={section.href} className="space-y-3">
                        <h4 className="font-semibold text-sm">{section.title}</h4>
                        {section.items && section.items.length > 0 && (
                            <ul className="space-y-2 border-l pl-4">
                                {section.items.map((item) => {
                                    const isActive = currentPath === item.href;
                                    return (
                                        <li key={item.href}>
                                            <Link
                                                to={item.href}
                                                className={cn(
                                                    'text-sm transition-colors block py-1',
                                                    isActive
                                                        ? 'text-foreground font-medium'
                                                        : 'text-muted-foreground hover:text-foreground'
                                                )}
                                            >
                                                {item.title}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}
