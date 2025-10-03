import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Zap, Shield, Package } from 'lucide-react'
import { repoURL, description } from '../../../package.json'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout'
import { Link } from 'react-router'

export function HomePage() {
    return (
        <div className="min-h-screen mx-auto max-w-screen-2xl">
            {/* Hero Section */}
            <Header />
            <section className="container flex flex-col items-center justify-center min-h-[80vh] text-center">
                <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl mb-6">
                    Primehooks
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mb-8">
                   {description} 
                </p>
                <div className="flex gap-4">
                    <Button asChild size="lg">
                        <Link to="/docs/introduction">
                            Get Started <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <a href={repoURL} target="_blank" rel="noopener noreferrer">
                            View on GitHub
                        </a>
                    </Button>
                </div>
            </section>

            {/* Features Section */}
            <section className="container py-20">
                <h2 className="text-3xl font-bold text-center mb-12">Why Choose This Library?</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <Card>
                        <CardHeader>
                            <Zap className="h-10 w-10 mb-2 text-primary" />
                            <CardTitle>Lightning Fast</CardTitle>
                            <CardDescription>
                                Zero dependencies and optimized for performance. Tree-shakeable exports keep your bundle size minimal.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Shield className="h-10 w-10 mb-2 text-primary" />
                            <CardTitle>Type Safe</CardTitle>
                            <CardDescription>
                                Written in TypeScript with full type definitions. Get autocomplete and type checking out of the box.
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <Package className="h-10 w-10 mb-2 text-primary" />
                            <CardTitle>Well Tested</CardTitle>
                            <CardDescription>
                                Comprehensive test coverage ensures reliability. Battle-tested in production applications.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </section>

            {/* Quick Example Section */}
            <section className="container py-20">
                <h2 className="text-3xl font-bold text-center mb-12">Quick Example</h2>
                <Card className="max-w-2xl mx-auto">
                    <CardContent className="pt-6">
                        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                            <code className="text-sm">{`import { useCounter } from 'your-hooks-library';

function Counter() {
  const { count, increment, decrement } = useCounter(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}`}</code>
                        </pre>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
