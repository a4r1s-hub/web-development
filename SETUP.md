# Portfolio CMS Setup Instructions

## Local SQLite Setup

This portfolio CMS uses SQLite for local hosting. Follow these steps to set up your environment:

### 1. Environment Variables

Create a `.env.local` file in the root directory with:

```
DATABASE_URL="file:./portfolio.db"
```

### 2. Initialize the Database

After setting the environment variable, the database will be automatically created and seeded with your initial admin account:

- **Email**: andreiv.dinu@outlook.com
- **Password**: Pula123

### 3. Run the Application

```bash
npm install
npm run dev
```

### 4. Access Points

- **Public Portfolio**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **Admin Dashboard**: http://localhost:3000/admin (after login)

### Database Location

The SQLite database file `portfolio.db` will be created in the root directory. This file contains all your portfolio data and can be backed up by simply copying the file.

### Content Types

The CMS supports:
- **Web Design Projects** - Showcase websites with external URLs
- **Graphic Design Work** - Display graphic design pieces
- **Video/Motion Design Projects** - Showcase video and motion design work
- **About Section** - Editable bio and information

Each project supports:
- Title and description
- Multiple images
- External project URL
- Featured toggle
- Category assignment
