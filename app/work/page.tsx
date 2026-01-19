import { getDb } from '@/lib/db';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PortfolioNav from '@/components/portfolio-nav';

export default function WorkPage() {
  const db = getDb();
  const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
  const categories = db.prepare('SELECT DISTINCT category FROM projects ORDER BY category').all();

  return (
    <div className="min-h-screen bg-background">
      <PortfolioNav />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Work</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            A collection of projects showcasing web design, graphic design, and creative work across various mediums.
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-12">
            <Button variant="outline" size="sm">All</Button>
            {(categories as any[]).map((cat) => (
              <Button key={cat.category} variant="ghost" size="sm">
                {cat.category}
              </Button>
            ))}
          </div>
        )}

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No projects available yet.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {(projects as any[]).map((project) => (
              <Link
                key={project.id}
                href={`/work/${project.id}`}
                className="group block bg-card rounded-xl overflow-hidden border hover:shadow-xl transition-all"
              >
                <div className="aspect-video bg-muted relative overflow-hidden">
                  {project.thumbnail_url ? (
                    <img
                      src={project.thumbnail_url || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <span className="text-4xl font-bold opacity-20">{project.category}</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {project.category}
                    </span>
                    {project.featured === 1 && (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent/10 text-accent">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
