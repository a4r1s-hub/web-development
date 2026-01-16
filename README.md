# Studio Portfolio Website

This repository contains a lightweight portfolio website for showcasing graphic design, video editing, and multidisciplinary projects. Content is loaded from JSON files so the front-end stays clean, and it includes a visual CMS configuration for adding new projects and blog posts without hand-editing code.

## Pages

- `index.html` — landing page with featured work and latest posts
- `projects.html` — full project archive
- `blog.html` — blog/journal index

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
