import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { getDb } from '@/lib/db';
import AdminNav from '@/components/admin/admin-nav';
import ProjectForm from '@/components/admin/project-form';

export default async function NewProjectPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token || !verifyToken(token)) {
    redirect('/admin/login');
  }

  const db = getDb();
  const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Create New Project</h1>
        <ProjectForm categories={categories as any[]} />
      </main>
    </div>
  );
}
