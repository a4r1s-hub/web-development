import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { getDb } from '@/lib/db';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminNav from '@/components/admin/admin-nav';
import DeleteProjectButton from '@/components/admin/delete-project-button';

export default async function ProjectsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token || !verifyToken(token)) {
    redirect('/admin/login');
  }

  const db = getDb();
  const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground">Manage your portfolio projects</p>
          </div>
          <Button asChild>
            <Link href="/admin/projects/new">Create New Project</Link>
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">No projects yet. Create your first project!</p>
              <Button asChild>
                <Link href="/admin/projects/new">Create Project</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(projects as any[]).map((project) => (
              <Card key={project.id} className="overflow-hidden">
                {project.thumbnail_url && (
                  <div className="aspect-video bg-slate-200 relative overflow-hidden">
                    <img
                      src={project.thumbnail_url || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{project.category}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button asChild size="sm" className="flex-1">
                      <Link href={`/admin/projects/${project.id}`}>Edit</Link>
                    </Button>
                    <DeleteProjectButton projectId={project.id} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
