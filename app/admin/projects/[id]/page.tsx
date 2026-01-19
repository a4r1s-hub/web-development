import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { getDb } from '@/lib/db';
import AdminNav from '@/components/admin/admin-nav';
import ProjectForm from '@/components/admin/project-form';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token || !verifyToken(token)) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const db = getDb();
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();

  if (!project) {
    redirect('/admin/projects');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Edit Project</h1>
        <ProjectForm project={project as any} categories={categories as any[]} />
      </main>
    </div>
  );
}
