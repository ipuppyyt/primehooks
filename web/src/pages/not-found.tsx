import { Button } from '@/components/ui/button'
import { Link } from 'react-router'

export function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <p className="text-xl text-muted-foreground mb-8">
                    Page not found
                </p>
                <Button asChild>
                    <Link to="/">Return Home</Link>
                </Button>
            </div>
        </div>
    );
}
