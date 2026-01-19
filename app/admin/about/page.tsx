import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { getDb } from '@/lib/db';
import AdminNav from '@/components/admin/admin-nav';
import AboutForm from '@/components/admin/about-form';

export default async function AboutPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token || !verifyToken(token)) {
    redirect('/admin/login');
  }

  const db = getDb();
  const about = db.prepare('SELECT * FROM about WHERE id = 1').get();

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">Edit About Section</h1>
        <AboutForm about={about as any} />
      </main>
    </div>
  );
}
