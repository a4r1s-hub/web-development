import { getDb } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import PortfolioNav from '@/components/portfolio-nav';

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as any;

  if (!project) {
    notFound();
  }

  const relatedProjects = db
    .prepare('SELECT * FROM projects WHERE category = ? AND id != ? LIMIT 3')
    .all(project.category, id);

  return (
    <div className="min-h-screen bg-background">
      <PortfolioNav />

      <main className="container mx-auto px-4 py-16">
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/work">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Work
          </Link>
        </Button>

        <div className="max-w-5xl mx-auto">
          {/* Project Header */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                {project.category}
              </span>
              {project.featured === 1 && (
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-accent/10 text-accent">
                  Featured
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{project.title}</h1>
            {project.description && (
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                {project.description}
              </p>
            )}
            {project.project_url && (
              <div className="mt-6">
                <Button asChild size="lg">
                  <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                    View Live Project <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            )}
          </div>

          {/* Project Image */}
          {project.thumbnail_url && (
            <div className="mb-12 rounded-2xl overflow-hidden border bg-card">
              <img
                src={project.thumbnail_url || "/placeholder.svg"}
                alt={project.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Project Details */}
          <div className="prose prose-lg max-w-none mb-16">
            <p className="text-muted-foreground leading-relaxed">
              {project.description || 'No additional details available for this project.'}
            </p>
          </div>

          {/* Related Projects */}
          {relatedProjects.length > 0 && (
            <div className="border-t pt-12">
              <h2 className="text-2xl font-bold mb-8">More {project.category} Projects</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {(relatedProjects as any[]).map((related) => (
                  <Link
                    key={related.id}
                    href={`/work/${related.id}`}
                    className="group block bg-card rounded-xl overflow-hidden border hover:shadow-lg transition-all"
                  >
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {related.thumbnail_url ? (
                        <img
                          src={related.thumbnail_url || "/placeholder.svg"}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <span className="text-2xl font-bold opacity-20">{related.category}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold group-hover:text-primary transition-colors">
                        {related.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
