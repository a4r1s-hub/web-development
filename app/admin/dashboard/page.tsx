import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { getDb } from '@/lib/db';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LogoutButton from '@/components/admin/logout-button';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token || !verifyToken(token)) {
    redirect('/admin/login');
  }

  const db = getDb();
  const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC LIMIT 5').all();
  const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number };
  const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Portfolio CMS</h1>
            <p className="text-sm text-muted-foreground">Manage your portfolio content</p>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline">
              <Link href="/">View Site</Link>
            </Button>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Total projects in portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{projectCount.count}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Project categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{categories.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your content</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button asChild>
                <Link href="/admin/projects/new">New Project</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/about">Edit About</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Your latest portfolio work</CardDescription>
              </div>
              <Button asChild>
                <Link href="/admin/projects">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No projects yet. Create your first project to get started!</p>
                <Button asChild className="mt-4">
                  <Link href="/admin/projects/new">Create Project</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {(projects as any[]).map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">{project.category}</p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/projects/${project.id}`}>Edit</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
