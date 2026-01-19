# Studio Portfolio Website

This repository contains a lightweight portfolio website for showcasing graphic design, video editing, and multidisciplinary projects. Content can be served from a local database so you can add new projects and posts without editing code.

## Pages

- `index.html` — landing page with featured work and latest posts
- `projects.html` — full project archive
- `blog.html` — blog/journal index
- `admin/index.html` — local CMS login and editor

## Local Authentication + Database CMS

The site now includes a local CMS backed by SQLite with email/password authentication.

### Default admin account

- Email: `andreiv.dinu@outlook.com`
- Password: `Pula123`

> **Important:** Update the defaults in production by setting environment variables.

### Start the server

```bash
npm install
npm start
```

The server runs at `http://localhost:3000` and serves the static site plus the API.

### Change credentials and JWT secret

Use environment variables to override defaults:

```bash
DEFAULT_ADMIN_EMAIL="you@example.com" \
DEFAULT_ADMIN_PASSWORD="your-strong-password" \
JWT_SECRET="replace-with-a-long-secret" \
npm start
```

### Add content

1. Open `http://localhost:3000/admin/`.
2. Sign in with your admin credentials.
3. Add new projects or blog posts (include optional cover image and live link fields). They are stored in `data/app.db`. Refresh the site after saving to see updates.

## JSON fallback

If the API is unavailable, the site falls back to loading starter content from:

- `content/projects.json`
- `content/posts.json`

## Customize

- Update styles in `assets/styles.css`.
- Update layout/content in the HTML files.
