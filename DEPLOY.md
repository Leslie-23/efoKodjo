# Efo Kodjo - Deployment Guide

## Project Structure

```
efoKodjo/
  client/          # React (Vite) frontend - public site + CMS admin
    src/
      pages/
        PublicSite.jsx   # Public-facing brand site  (route: /)
        Admin.jsx        # CMS admin panel           (route: /admin)
      components/        # All section components (Hero, ContentFeed, etc.)
      styles/            # CSS (public.css, admin.css)
      api.js             # Axios calls to /api/*
    vite.config.js       # Dev proxy -> localhost:5000
    dist/                # Build output (after `npm run build`)

  server/            # Express + Mongoose API + image uploads
    index.js             # Entry point
    models/
      SiteContent.js     # Single-document CMS schema (all site data)
    routes/
      content.js         # GET /api/content, PUT /api/content, POST /api/content/upload
    models/
      Image.js           # Image storage model (binary in MongoDB)
    seed.js              # Seeds default content into MongoDB
    .env                 # Environment variables (not committed)
```

---

## Environment Variables

### server/.env

| Variable        | Description               | Example                                |
| --------------- | ------------------------- | -------------------------------------- |
| `PORT`        | Server port               | `5000`                               |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/efokodjo` |

### Future env vars to add when needed

| Variable           | When                                    | Example                                |
| ------------------ | --------------------------------------- | -------------------------------------- |
| `NODE_ENV`       | Distinguish dev/prod behavior           | `production`                         |
| `CLIENT_ORIGIN`  | Lock down CORS in production            | `https://efokodjo.com`               |
| `CLOUDINARY_URL` | If you move image uploads to Cloudinary | `cloudinary://key:secret@cloud_name` |
| `ADMIN_PASSWORD` | When you add CMS auth                   | `<strong random string>`             |
| `JWT_SECRET`     | If you add token-based admin auth       | `<strong random string>`             |
| `SESSION_SECRET` | If you use session-based admin auth     | `<strong random string>`             |

---

## Local Development

```bash
# 1. Start MongoDB locally (must be running)

# 2. Server
cd server
cp .env.example .env        # or create .env with PORT and MONGODB_URI
npm install
npm run seed                 # seed default content (first time only)
npm run dev                  # starts on :5000 with nodemon

# 3. Client (separate terminal)
cd client
npm install
npm run dev                  # starts on :5173, proxies /api + /uploads to :5000
```

Visit `http://localhost:5173` for the site, `http://localhost:5173/admin` for the CMS.

---

## Production Deployment

### Option A: Single VPS / Droplet (Recommended to start)

**Server: Render / Railway / DigitalOcean / any VPS**

1. Push repo to GitHub
2. Set up the server:

   ```bash
   cd server
   npm install
   npm run seed    # first time only
   npm start       # or use pm2: pm2 start index.js --name efo-server
   ```
3. Set env vars on host:

   - `PORT=5000`
   - `MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/efokodjo`
   - Use [MongoDB Atlas](https://cloud.mongodb.com) for hosted MongoDB (free tier available)
4. Build the client and serve from Express:

   ```bash
   cd client
   npm install
   npm run build   # outputs to client/dist/
   ```

   Then add static serving to `server/index.js`:

   ```js
   // After API routes
   app.use(express.static(path.join(__dirname, '../client/dist')));
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../client/dist/index.html'));
   });
   ```
**Domain + SSL:** Use Nginx as reverse proxy or the platform's built-in SSL.

### Option B: Split deployment

| What     | Where                               | Build command     | Root dir    |
| -------- | ----------------------------------- | ----------------- | ----------- |
| Client   | Vercel / Netlify / Cloudflare Pages | `npm run build` | `client/` |
| Server   | Render / Railway / Fly.io           | `npm start`     | `server/` |
| Database | MongoDB Atlas                       | -                 | -           |

If split:

- Client needs `VITE_API_URL` env var pointing to the server URL
- Update `client/src/api.js` to use it:
  ```js
  const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' })
  ```
- Server needs `CLIENT_ORIGIN` env var for CORS:
  ```js
  app.use(cors({ origin: process.env.CLIENT_ORIGIN }))
  ```

### Option C: Render (quickest)

1. Connect GitHub repo to Render
2. Create a **Web Service** for the server:
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`
   - Add env vars: `MONGODB_URI`, `PORT`
3. Create a **Static Site** for the client:
   - Root directory: `client`
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Add rewrite rule: `/*` -> `/index.html` (for SPA routing)

---

## Deploy Checklist

- [ ] MongoDB Atlas cluster created, connection string ready
- [ ] `server/.env` has production `MONGODB_URI`
- [ ] Run `npm run seed` once on production to create default content
- [ ] Client built with `npm run build`
- [ ] If single-server: Express serves `client/dist/` as static files
- [ ] If split: `VITE_API_URL` and `CLIENT_ORIGIN` env vars are set
- [ ] Custom domain pointed, SSL enabled
- [ ] `/admin` route is accessible (add auth before going live)

---

## Important Notes

- **No admin auth yet.** The `/admin` route is open. Add password protection before deploying publicly.
- **Image uploads** are stored as binary in MongoDB (separate `images` collection). No filesystem dependency — works on any host.
- **Database** uses a single-document pattern. One `SiteContent` document holds all site data. `npm run seed` creates it with defaults.
- **TikTok embeds** in the Content Feed load via iframe from `tiktok.com/embed/v2/`. No API key needed.
