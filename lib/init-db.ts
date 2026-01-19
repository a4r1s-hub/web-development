import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

export function initializeDatabase(db: Database.Database) {
  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category_id INTEGER,
      image_url TEXT,
      project_url TEXT,
      featured BOOLEAN DEFAULT 0,
      published BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS about (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      bio TEXT,
      skills TEXT,
      profile_image_url TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category_id);
    CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
    CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);
  `);

  console.log('[v0] Database tables created');

  // Check if default user exists
  const userExists = db.prepare('SELECT COUNT(*) as count FROM users WHERE email = ?')
    .get('andreiv.dinu@outlook.com') as { count: number };

  if (userExists.count === 0) {
    // Insert default user
    const hashedPassword = bcrypt.hashSync('Pula123', 10);
    db.prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)')
      .run('andreiv.dinu@outlook.com', hashedPassword, 'Andrei Dinu');
    console.log('[v0] Default user created');
  }

  // Insert default categories
  const categories = [
    ['Web Design', 'web-design'],
    ['Graphic Design', 'graphic-design'],
    ['Video & Motion Design', 'video-motion-design']
  ];

  for (const [name, slug] of categories) {
    const exists = db.prepare('SELECT COUNT(*) as count FROM categories WHERE slug = ?')
      .get(slug) as { count: number };
    
    if (exists.count === 0) {
      db.prepare('INSERT INTO categories (name, slug) VALUES (?, ?)').run(name, slug);
      console.log(`[v0] Category created: ${name}`);
    }
  }

  // Insert default about section
  const aboutExists = db.prepare('SELECT COUNT(*) as count FROM about WHERE id = 1')
    .get() as { count: number };

  if (aboutExists.count === 0) {
    db.prepare('INSERT INTO about (id, title, bio, skills) VALUES (1, ?, ?, ?)')
      .run('About Me', 'Creative designer and developer.', 'Web Design, Graphic Design, Motion Graphics');
    console.log('[v0] Default about section created');
  }

  console.log('[v0] Database initialization complete');
}
