# Studio Portfolio Website

This repository contains a lightweight portfolio website for showcasing graphic design, video editing, and multidisciplinary projects. Content can be served from a local database so you can add new projects and posts without editing code.
This repository contains a lightweight portfolio website for showcasing graphic design, video editing, and multidisciplinary projects. Content is loaded from JSON files so the front-end stays clean, and it includes a visual CMS configuration for adding new projects and blog posts without hand-editing code.

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
3. Add new projects or blog posts (include optional cover image and live link fields). They are stored in `data/app.db`.
3. Add new projects or blog posts. They are stored in `data/app.db`.

## JSON fallback

If the API is unavailable, the site falls back to loading starter content from:

- `content/projects.json`
- `content/posts.json`

## Content Management (No Code Editing)

This site is wired for **Decap CMS** (formerly Netlify CMS) so you can add or update content in a visual editor.

1. **Deploy the site** (Netlify or any static host).
2. **Enable Netlify Identity + Git Gateway** (if using Netlify).
3. Visit `/admin/` on your deployed site to access the CMS.
4. Add or update items in the **Projects** and **Blog Posts** lists.

The CMS updates these files automatically:

- `content/projects.json`
- `content/posts.json`

## Local Preview

To preview locally, use a simple static server (example shown with Python):

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Customize

- Update styles in `assets/styles.css`.
- Update layout/content in the HTML files.
- Add uploads to `assets/uploads` if you enable media uploads in Decap CMS.
