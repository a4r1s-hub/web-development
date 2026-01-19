import { getDb } from '@/lib/db';
import PortfolioNav from '@/components/portfolio-nav';

export default function AboutPage() {
  const db = getDb();
  const about = db.prepare('SELECT * FROM about WHERE id = 1').get() as any;

  const skills = about?.skills
    ? about.skills.split(/[\n,]/).map((s: string) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <PortfolioNav />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-12">
            {about?.title || 'About Me'}
          </h1>

          <div className="grid md:grid-cols-3 gap-12 mb-16">
            {about?.profile_image_url && (
              <div className="md:col-span-1">
                <div className="aspect-square rounded-2xl overflow-hidden bg-muted border">
                  <img
                    src={about.profile_image_url || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            <div className={about?.profile_image_url ? 'md:col-span-2' : 'md:col-span-3'}>
              <div className="prose prose-lg max-w-none">
                {about?.bio ? (
                  about.bio.split('\n').map((paragraph: string, i: number) => (
                    <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-muted-foreground leading-relaxed">
                    Welcome to my portfolio. I'm a creative professional passionate about design and technology.
                  </p>
                )}
              </div>
            </div>
          </div>

          {skills.length > 0 && (
            <div className="border-t pt-12">
              <h2 className="text-2xl font-bold mb-6">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
