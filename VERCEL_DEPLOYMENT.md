# 🚀 Hosting CodeServir on Vercel

Since you have separated the project into `frontend` and `backend`, the best approach is **"Alag Alag Deployment" (Separate Deployment)**. This is easier to manage and scale.

## 🏗️ 1. Deploying the Backend
We will deploy the backend first so we can get the API URL.

1.  **Push your code to GitHub/GitLab/Bitbucket.**
    - If you haven't initialized git:
      ```bash
      git init
      git add .
      git commit -m "Initial commit"
      # Add remote and push
      ```

2.  **Go to Vercel Dashboard** and click **"Add New..."** -> **"Project"**.

3.  **Import your Git Repository.**

4.  **Configure Project:**
    - Give it a name like `codeservir-backend`.
    - **Root Directory:** Click "Edit" and select `backend`. **(Important!)**
    - **Framework Preset:** Select "Other" (or Express if available, but default is fine).
    - **Environment Variables:** Add all variables from your `backend/.env` file:
      - `DB_USER`: Your cloud database user (e.g., Neon Tech, Supabase, or AWS RDS). **Note: You need a cloud database, local PostgreSQL won't work!**
      - `DB_PASSWORD`: Cloud DB password.
      - `DB_HOST`: Cloud DB host.
      - `DB_NAME`: Cloud DB name.
      - `DB_PORT`: `5432`.
      - `OPENAI_API_KEY`: Your key.
      - `PINECONE_API_KEY`: Your key.
      - `PINECONE_ENV`: Your env (e.g., `gcp-starter`).
      - `REDIS_URL`: Your cloud Redis URL (e.g., Upstash Redis). **Local Redis won't work!**
      - `CDN_URL`: leave empty or set to your frontend URL later.

5.  **Click Deploy.**
    - Once deployed, Vercel will give you a domain (e.g., `https://codeservir-api.vercel.app/`).
    - **Copy this URL.**

---

## 🎨 2. Deploying the Frontend
Now we deploy the React app.

1.  **Go to Vercel Dashboard** and click **"Add New..."** -> **"Project"**.

2.  **Import the SAME Git Repository.**

3.  **Configure Project:**
    - Give it a name like `codeservir-frontend`.
    - **Root Directory:** Click "Edit" and select `frontend`. **(Important!)**
    - **Framework Preset:** "Create React App" (should be auto-detected).
    - **Environment Variables:**
      - `REACT_APP_API_URL`: Paste the backend URL from Step 1 (e.g., `https://codeservir-api.vercel.app//api`).
      - `REACT_APP_WIDGET_URL`: `https://codeservir-api.vercel.app/`.

4.  **Click Deploy.**
    - Your app is now live! 🚀

---

## ⚠️ Important Considerations for Vercel

1.  **Database & Redis:**
    - You CANNOT use `localhost` databases on Vercel.
    - **PostgreSQL:** Use [Neon](https://neon.tech) or [Supabase](https://supabase.com) (Free tiers available).
    - **Redis:** Use [Upstash](https://upstash.com) (Free tier available).

2.  **Timeouts:**
    - Vercel Serverless functions have a 10-second timeout on the free plan (60s on Pro).
    - The "Build Knowledge Base" step (scraping website) takes time. It might timeout.
    - **Solution:** If it times out, consider moving the scraper to a background job service (like Inngest or Zeplo) or hosting the backend on **Render.com** (which supports long-running servers) instead of Vercel.

3.  **CORS:**
    - Update your Backend Environment Variable `CORS_ORIGIN` to match your new Frontend Vercel URL (e.g., `https://codeservir-frontend.vercel.app`).

---

## ✅ Recommendation
- **Frontend** -> **Vercel** (Excellent choice).
- **Backend** -> **Render.com** or **Railway.app** (Better for long-running Node.js apps with DB connections).
  - *If you stick to Vercel for backend, just be aware of the timeout limits.*
