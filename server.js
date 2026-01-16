import express from "express";
import sqlite3 from "sqlite3";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET || "replace-this-secret";
const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || "andreiv.dinu@outlook.com";
const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || "Pula123";
const dbPath = path.join(__dirname, "data", "app.db");

app.use(express.json());
app.use(express.static(__dirname));
app.use("/admin", express.static(path.join(__dirname, "admin")));

app.get("/admin", (req, res) => {
  res.redirect("/admin/");
});

const db = new sqlite3.Database(dbPath);

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
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`
  );

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
    "SELECT title, summary, category, date, role FROM projects ORDER BY created_at DESC",
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Failed to load projects" });
      }
      return res.json({ projects: rows });
    }
  );
});

app.post("/api/projects", authenticate, (req, res) => {
  const { title, summary, category, date, role } = req.body;
  db.run(
    "INSERT INTO projects (title, summary, category, date, role) VALUES (?, ?, ?, ?, ?)",
    [title, summary, category, date, role],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Failed to save project" });
      }
      return res.status(201).json({ id: this.lastID });
    }
  );
});

app.get("/api/posts", (req, res) => {
  db.all(
    "SELECT title, summary, category, date, read_time as readTime FROM posts ORDER BY created_at DESC",
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Failed to load posts" });
      }
      return res.json({ posts: rows });
    }
  );
});

app.post("/api/posts", authenticate, (req, res) => {
  const { title, summary, category, date, readTime } = req.body;
  db.run(
    "INSERT INTO posts (title, summary, category, date, read_time) VALUES (?, ?, ?, ?, ?)",
    [title, summary, category, date, readTime],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Failed to save post" });
      }
      return res.status(201).json({ id: this.lastID });
    }
  );
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
