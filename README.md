# AI Career Counselling

This repository contains a React frontend and an Express backend for a career counselling application.

## Project structure

- `frontend/` – React app
- `backend/` – Node/Express API

## Deployment recommendation

This project is best deployed as two separate services:

1. Backend: deploy the `backend/` folder to a free Node host such as Render.
2. Frontend: deploy the `frontend/` folder to Netlify.

### Backend deployment (Render)

1. Push your repo to GitHub.
2. Create a free Render account and import this GitHub repo.
3. Create a new **Web Service**.
4. Set the repository root directory to `backend`.
5. Use:
   - Build command: `npm install`
   - Start command: `npm start`
6. Add environment variables in Render:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `GOOGLE_API_KEY` (optional for AI proxy)

After deployment, copy the backend URL.

### Frontend deployment (Netlify)

1. Create a free Netlify account.
2. In Netlify, add a new site from GitHub and select this repo.
3. Set the build settings as:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `build`
4. In the Netlify environment variables, add:
   - `REACT_APP_API_URL` = `https://<YOUR_BACKEND_URL>`

5. Deploy the site.

### Notes

- The frontend uses `process.env.REACT_APP_API_URL || '/api'`, so a deployed frontend can talk to your deployed backend when `REACT_APP_API_URL` is set.
- If you prefer Vercel, deploy the React app from `frontend/` and configure the same environment variable.
- If you want to use the same domain for frontend and backend, you can also deploy both under one platform using a monorepo setup, but separating them is easiest.

## What was added for deployment

- `backend/Procfile` – helps Render understand the backend start command.
- `frontend/netlify.toml` – helps Netlify build from the monorepo.

## Next step

If you want, I can also help generate a `vercel.json` configuration for Vercel or a `render.yaml` file for Render import.
