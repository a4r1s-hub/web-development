import Link from 'next/link';

export default function PortfolioNav() {
  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-foreground">
            Portfolio
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/work" className="text-sm font-medium hover:text-primary transition-colors">
              Work
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
