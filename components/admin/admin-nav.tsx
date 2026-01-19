import Link from 'next/link';
import { Button } from '@/components/ui/button';
import LogoutButton from './logout-button';

export default function AdminNav() {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin/dashboard" className="text-xl font-bold">
              Portfolio CMS
            </Link>
            <nav className="hidden md:flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/dashboard">Dashboard</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/projects">Projects</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/about">About</Link>
              </Button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/">View Site</Link>
            </Button>
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
