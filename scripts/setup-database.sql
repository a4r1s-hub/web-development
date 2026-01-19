-- Portfolio CMS Database Schema

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- About section table
CREATE TABLE IF NOT EXISTS about (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  bio TEXT,
  skills TEXT, -- JSON array of skills
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Project categories
CREATE TABLE IF NOT EXISTS project_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

-- Projects table (web design, graphic design, video/motion)
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  category_id INTEGER NOT NULL,
  project_url TEXT, -- External URL or subdomain
  thumbnail_url TEXT,
  image_urls TEXT, -- JSON array of image URLs
  tags TEXT, -- JSON array of tags
  featured BOOLEAN DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES project_categories(id)
);

-- Insert default categories
INSERT INTO project_categories (name, slug) VALUES 
  ('Web Design', 'web-design'),
  ('Graphic Design', 'graphic-design'),
  ('Video & Motion Design', 'video-motion-design')
ON CONFLICT(slug) DO NOTHING;

-- Insert initial admin user (email: andreiv.dinu@outlook.com, password: Pula123)
-- Password hash generated with bcrypt rounds=10
INSERT INTO users (email, password_hash) VALUES 
  ('andreiv.dinu@outlook.com', '$2a$10$rGYN7vYZXqXP8sJK6BqZFu7DqJ7FqC3xJKQ0XBqZFu7DqJ7FqC3xJ')
ON CONFLICT(email) DO NOTHING;

-- Insert default about content
INSERT INTO about (content, bio, skills) VALUES 
  ('Welcome to my portfolio', 'I am a creative professional specializing in web design, graphic design, and video production.', '["Web Design", "Graphic Design", "Video Production", "Motion Design"]')
ON CONFLICT DO NOTHING;
