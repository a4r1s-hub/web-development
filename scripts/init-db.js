const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

// Create database file in the project root
const dbPath = path.join(process.cwd(), 'portfolio.db');
const db = new Database(dbPath);

console.log('[v0] Initializing SQLite database at:', dbPath);

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

console.log('[v0] Tables created successfully');

// Insert default user
const hashedPassword = bcrypt.hashSync('Pula123', 10);
const insertUser = db.prepare('INSERT OR IGNORE INTO users (email, password, name) VALUES (?, ?, ?)');
const userResult = insertUser.run('andreiv.dinu@outlook.com', hashedPassword, 'Andrei Dinu');

if (userResult.changes > 0) {
  console.log('[v0] Default user created: andreiv.dinu@outlook.com');
} else {
  console.log('[v0] Default user already exists');
}

// Insert default categories
const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (name, slug) VALUES (?, ?)');
const categories = [
  ['Web Design', 'web-design'],
  ['Graphic Design', 'graphic-design'],
  ['Video & Motion Design', 'video-motion-design']
];

for (const [name, slug] of categories) {
  const result = insertCategory.run(name, slug);
  if (result.changes > 0) {
    console.log(`[v0] Category created: ${name}`);
  }
}

// Insert default about section
const insertAbout = db.prepare(`
  INSERT OR IGNORE INTO about (id, title, bio, skills) 
  VALUES (1, 'About Me', 'Creative designer and developer.', 'Web Design, Graphic Design, Motion Graphics')
`);
const aboutResult = insertAbout.run();

if (aboutResult.changes > 0) {
  console.log('[v0] Default about section created');
}

db.close();
console.log('[v0] Database initialization complete!');
