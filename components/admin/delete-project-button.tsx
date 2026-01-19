'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export default function DeleteProjectButton({ projectId }: { projectId: number }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    const res = await fetch(`/api/projects/${projectId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      router.refresh();
    }
  };

  return (
    <Button onClick={handleDelete} variant="destructive" size="sm">
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
