# Deployment Guide — GitHub + Render + Vercel

This walks through getting your project from your laptop onto the live internet, completely free, using:
- **GitHub** — stores your code
- **Render** — hosts the backend (FastAPI + YOLOv8 model)
- **Vercel** — hosts the frontend (React dashboard)

Follow these steps **in order**.

---

## Step 1 — Push your code to GitHub

If you haven't already initialized git in the project folder:

```bash
cd border-surveillance-ai
git init
git add .
git commit -m "Initial commit: border surveillance anomaly detection system"
```

Create a new repository on GitHub (via the website): click **New repository**, name it something like `border-surveillance-anomaly-detection`, leave it empty (no README/gitignore — you already have those), then run the commands GitHub shows you, which will look like:

```bash
git remote add origin https://github.com/YOUR_USERNAME/border-surveillance-anomaly-detection.git
git branch -M main
git push -u origin main
```

✅ Checkpoint: refresh your GitHub repo page — you should see all your folders (`backend/`, `frontend/`, `ml/`, etc).

---

## Step 2 — Deploy the backend on Render

1. Go to [render.com](https://render.com) and sign up / log in (you can sign in with your GitHub account directly).
2. Click **New +** → **Web Service**.
3. Connect your GitHub account if prompted, then select your `border-surveillance-anomaly-detection` repo.
4. Render should detect the `render.yaml` file in your repo and offer to use it. If it asks you to confirm settings, make sure:
   - **Runtime:** Docker
   - **Dockerfile path:** `backend/Dockerfile`
   - **Docker build context directory:** `.` (the repo root — this matters because the Dockerfile needs to copy both `backend/` and `ml/`)
   - **Plan:** Free
5. Click **Create Web Service** / **Deploy**.

Render will now build your Docker image and deploy it. **The first build will take a few minutes** because it installs PyTorch, OpenCV, and Ultralytics, and downloads the YOLOv8 model weights.

6. Once deployed, Render gives you a URL like:
   ```
   https://border-surveillance-backend.onrender.com
   ```
   Copy this — you'll need it in Step 3.

7. Test it: visit `https://YOUR-RENDER-URL.onrender.com/health` in your browser. You should see:
   ```json
   {"status": "ok"}
   ```

### ⚠️ Free tier note
Render's free tier "spins down" your service after 15 minutes of no traffic, and takes ~30-60 seconds to "wake up" on the next request. This is normal — just mention it during your demo ("the first request may take a moment because of free-tier cold start").

---

## Step 3 — Deploy the frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up / log in with GitHub.
2. Click **Add New...** → **Project**.
3. Import your `border-surveillance-anomaly-detection` repo.
4. When configuring the project:
   - **Root Directory:** click "Edit" and set it to `frontend` (important — your React app lives inside the `frontend/` subfolder, not the repo root)
   - **Framework Preset:** Vercel should auto-detect "Vite"
5. Before deploying, add an environment variable:
   - **Name:** `VITE_API_URL`
   - **Value:** the Render backend URL from Step 2, e.g. `https://border-surveillance-backend.onrender.com`
6. Click **Deploy**.

Once done, Vercel gives you a live URL like:
```
https://border-surveillance-anomaly-detection.vercel.app
```

This is your live, shareable project link.

---

## Step 4 — Verify everything works end-to-end

1. Open your Vercel URL in the browser.
2. Upload a real photo (containing people or vehicles, ideally outdoors).
3. Click **RUN ANOMALY SCAN**.
4. You should see detection results appear, and a new row added to the Alert Log.

If something doesn't work, check:
- **CORS errors in browser console** → confirm the backend's CORS middleware in `backend/app/main.py` allows your Vercel domain (it currently allows `*`, so this shouldn't happen, but double check if you changed it).
- **"Network Error" / can't reach backend** → double-check the `VITE_API_URL` environment variable on Vercel matches your actual Render URL exactly (including `https://`, no trailing slash).
- **Backend takes a long time to respond on first request** → this is the Render free-tier cold start mentioned above. Wait ~30-60 seconds and try again.

---

## Step 5 — Updating your deployment after making changes

Both Render and Vercel are connected to your GitHub repo, so future updates are simple:

```bash
git add .
git commit -m "Describe what you changed"
git push
```

Both Render and Vercel will automatically detect the new commit and redeploy. No manual redeployment steps needed.

---

## Summary of URLs you'll end up with

| Service | What it hosts | Example URL |
|---|---|---|
| GitHub | Your source code | `github.com/you/border-surveillance-anomaly-detection` |
| Render | Backend API (FastAPI + YOLOv8) | `border-surveillance-backend.onrender.com` |
| Vercel | Frontend dashboard (React) | `border-surveillance-anomaly-detection.vercel.app` |

Put the Vercel link in your project report/resume — that's the one people will actually click on.
