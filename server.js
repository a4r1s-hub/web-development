import express from "express";
import sqlite3 from "sqlite3";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET || "replace-this-secret";
const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || "andreiv.dinu@outlook.com";
const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || "Pula123";
const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "app.db");

app.use(express.json());
app.use(express.static(__dirname));
app.use("/admin", express.static(path.join(__dirname, "admin")));

app.get("/admin", (req, res) => {
  res.redirect("/admin/");
});

fs.mkdirSync(dataDir, { recursive: true });

const db = new sqlite3.Database(dbPath);

const loadFallbackContent = (fileName, key) => {
  try {
    const filePath = path.join(__dirname, "content", fileName);
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      return data;
    }
    return data?.[key] || [];
  } catch (error) {
    console.error(`Failed to load fallback ${fileName}`, error);
    return [];
  }
};

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      role TEXT NOT NULL,
      image_url TEXT,
      link_url TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      read_time TEXT NOT NULL,
      image_url TEXT,
      link_url TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`
  );

  db.run("ALTER TABLE projects ADD COLUMN image_url TEXT", () => {});
  db.run("ALTER TABLE projects ADD COLUMN link_url TEXT", () => {});
  db.run("ALTER TABLE posts ADD COLUMN image_url TEXT", () => {});
  db.run("ALTER TABLE posts ADD COLUMN link_url TEXT", () => {});

  db.get("SELECT id FROM users WHERE email = ?", [defaultEmail], async (err, row) => {
    if (err) {
      console.error("Failed to seed admin user", err);
      return;
    }
    if (!row) {
      const hash = await bcrypt.hash(defaultPassword, 10);
      db.run("INSERT INTO users (email, password_hash) VALUES (?, ?)", [defaultEmail, hash]);
    }
  });
});

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }
  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT id, email, password_hash FROM users WHERE email = ?", [email], async (err, row) => {
    if (err || !row) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, row.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: row.id, email: row.email }, jwtSecret, { expiresIn: "8h" });
    return res.json({ token });
  });
});

app.get("/api/projects", (req, res) => {
  db.all(
    "SELECT title, summary, category, date, role, image_url as imageUrl, link_url as linkUrl FROM projects ORDER BY created_at DESC",
    (err, rows) => {
      if (err) {
        console.error("Failed to load projects", err);
      }
      const data = err || rows.length === 0 ? loadFallbackContent("projects.json", "projects") : rows;
      return res.json({ projects: data });
    }
  );
});

app.post("/api/projects", authenticate, (req, res) => {
  const { title, summary, category, date, role, imageUrl, linkUrl } = req.body;
  if (!title || !summary || !category || !date || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  db.run(
    "INSERT INTO projects (title, summary, category, date, role, image_url, link_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [title, summary, category, date, role, imageUrl || null, linkUrl || null],
    function (err) {
      if (err) {
        console.error("Failed to save project", err);
        return res.status(500).json({ error: "Failed to save project" });
      }
      return res.status(201).json({ id: this.lastID });
    }
  );
});

app.get("/api/posts", (req, res) => {
  db.all(
    "SELECT title, summary, category, date, read_time as readTime, image_url as imageUrl, link_url as linkUrl FROM posts ORDER BY created_at DESC",
    (err, rows) => {
      if (err) {
        console.error("Failed to load posts", err);
      }
      const data = err || rows.length === 0 ? loadFallbackContent("posts.json", "posts") : rows;
      return res.json({ posts: data });
    }
  );
});

app.post("/api/posts", authenticate, (req, res) => {
  const { title, summary, category, date, readTime, imageUrl, linkUrl } = req.body;
  if (!title || !summary || !category || !date || !readTime) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  db.run(
    "INSERT INTO posts (title, summary, category, date, read_time, image_url, link_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [title, summary, category, date, readTime, imageUrl || null, linkUrl || null],
    function (err) {
      if (err) {
        console.error("Failed to save post", err);
        return res.status(500).json({ error: "Failed to save post" });
      }
      return res.status(201).json({ id: this.lastID });
    }
  );
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
