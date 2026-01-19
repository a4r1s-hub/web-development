import Database from 'better-sqlite3';
import path from 'path';
import { initializeDatabase } from './init-db';

const dbPath = path.join(process.cwd(), 'portfolio.db');

// Create singleton database connection
let db: Database.Database | null = null;
let initialized = false;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL'); // Better performance
    db.pragma('foreign_keys = ON'); // Enable foreign keys
    
    // Initialize database on first connection
    if (!initialized) {
      initializeDatabase(db);
      initialized = true;
    }
  }
  return db;
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

