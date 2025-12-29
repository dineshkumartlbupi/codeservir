
# 🚀 Vercel Monorepo Deployment Guide for CodeServir

Since your project contains both `frontend` and `backend` in a single repository (`codeservir`), you need to create **two separate projects** in Vercel, but connect them to the **same Git repository**.

This setup ensures that:
- Changes to `frontend/` only trigger a Frontend build.
- Changes to `backend/` only trigger a Backend build.
- Pushing to GitHub deploys both automatically if both folders changed.

---

## 🏗️ Step 1: Deploy Backend

1.  **Go to Vercel Dashboard** -> **Add New Project**.
2.  **Import** your `codeservir` GitHub repository.
3.  **Configure Project Settings**:
    *   **Project Name**: `codeservir-backend` (or similar)
    *   **Framework Preset**: Other (or Express/Node.js)
    *   **Root Directory**: Click "Edit" and select `backend`.
4.  **Environment Variables**:
    *   Add your database keys (`DATABASE_URL`, `REDIS_URL`, etc.).
5.  **Deploy**.

## 🎨 Step 2: Deploy Frontend

1.  **Go to Vercel Dashboard** -> **Add New Project** (Again).
2.  **Import** the SAME `codeservir` GitHub repository.
3.  **Configure Project Settings**:
    *   **Project Name**: `codeservir-frontend`
    *   **Framework Preset**: Next.js / React / Vite (Vercel usually auto-detects this).
    *   **Root Directory**: Click "Edit" and select `frontend`.
4.  **Environment Variables**:
    *   `NEXT_PUBLIC_API_URL` (or similar): Set this to your **deployed backend URL** (e.g., `https://codeservir-api.vercel.app/`).
5.  **Deploy**.

---

## ⚙️ Step 3: Configure "Ignored Build Step" (Optimization)

To prevent the Frontend from rebuilding when you only touch Backend code (and vice versa), use Vercel's "Ignored Build Step" command.

**For Frontend Project:**
- Go to **Settings** > **Git** > **Ignored Build Step**.
- Command: `git diff --quiet HEAD^ HEAD ./` (This checks if changes happened in the root directory, which is set to `frontend` so it works automatically).

**For Backend Project:**
- Go to **Settings** > **Git** > **Ignored Build Step**.
- Command: `git diff --quiet HEAD^ HEAD ./`

---

## ✅ Summary
You will have two Vercel projects linked to one GitHub repo. Vercel handles the rest automatically!
