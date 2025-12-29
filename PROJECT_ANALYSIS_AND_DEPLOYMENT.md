# Project Analysis & Deployment Guide

## 🔍 Project Analysis

I have analyzed the `codeservir` project, which consists of a **React Frontend** and an **Express/Node.js Backend** (Monorepo structure).

### ✅ Status Check
| Component | Status | Notes |
|-----------|--------|-------|
| **Backend** | 🟢 Ready | Express + TypeScript. Fixed Pinecone initialization and added Puppeteer fallback for Vercel. |
| **Frontend** | 🟢 Ready | React. Fixed hardcoded API URL to use environment variables (`REACT_APP_API_URL`). |
| **Database** | 🟡 Config Required | Requires PostgreSQL and Redis (e.g., Neon/Supabase + Upstash). |
| **Scraping** | ⚠️ Limited | Basic scraping enabled. Full Puppeteer scraping on Vercel requires specialized setup (currently falls back to simple scraping). |

### 🛠️ Fixes Applied
1.  **Pinecone Initialization**: Fixed a critical bug in `backend/src/config/pinecone.ts` where the client could be null or the function was duplicated.
2.  **Frontend API URL**: Replaced hardcoded `http://localhost:5001` in `LandingPage.tsx` with dynamic `process.env.REACT_APP_API_URL` to support production deployment.
3.  **Vercel Scraping**: Added safety checks in `scraper.service.ts` to prevent crashes on Vercel by falling back to lightweight scraping if Puppeteer fails.
4.  **Environment Config**: Created `.env.development` and `.env.production` for the frontend.

---

## 🚀 Deployment Instructions (Vercel)

You will deploy the Frontend and Backend as **two separate Vercel projects** linked to the same repository.

### Prerequisites
Ensure you have the following keys ready:
-   `OPENAI_API_KEY`
-   `PINECONE_API_KEY`
-   `PINECONE_INDEX_NAME`
-   `DATABASE_URL` (PostgreSQL Connection String)
-   `REDIS_URL` (Redis Connection String)
-   `RAZORPAY_KEY_ID` & `SECRET` (Optional)

### Step 1: Deploy Backend

1.  Go to [Vercel Dashboard](https://vercel.com/dashboard) -> **Add New** -> **Project**.
2.  Import your `codeservir` repository.
3.  **Configure Project**:
    -   **Project Name**: `codeservir-backend`
    -   **Framework Preset**: Other
    -   **Root Directory**: Click `Edit` and select `backend`.
4.  **Environment Variables**: Add the following:
    -   `OPENAI_API_KEY`: `sk-...`
    -   `PINECONE_API_KEY`: `...`
    -   `PINECONE_INDEX_NAME`: `codeservir-embeddings`
    -   `DATABASE_URL`: `postgres://...`
    -   `REDIS_URL`: `redis://...`
    -   `CORS_ORIGIN`: `https://codeservir-frontend.vercel.app` (You will update this after deploying frontend)
5.  **Deploy**.
6.  **Copy the Backend URL** (e.g., `https://codeservir-api.vercel.app/`).

### Step 2: Deploy Frontend

1.  Go to [Vercel Dashboard](https://vercel.com/dashboard) -> **Add New** -> **Project**.
2.  Import the same `codeservir` repository again.
3.  **Configure Project**:
    -   **Project Name**: `codeservir-frontend`
    -   **Framework Preset**: Create React App
    -   **Root Directory**: Click `Edit` and select `frontend`.
4.  **Environment Variables**: Add the following:
    -   `REACT_APP_API_URL`: Paste your **Backend URL** from Step 1 (e.g., `https://codeservir-api.vercel.app/`).
        *   *Note: Do not add a trailing slash.*
5.  **Deploy**.

### Step 3: Final Wiring

1.  Go back to your **Backend Project** on Vercel.
2.  Update the `CORS_ORIGIN` environment variable to match your **Frontend URL** (e.g., `https://codeservir-frontend.vercel.app`).
3.  Redeploy the Backend (Deployments -> Redeploy) for changes to take effect.

---

## 💻 Local Development

1.  **Backend**:
    ```bash
    cd backend
    npm install
    # Ensure .env has all keys
    npm run dev
    ```

2.  **Frontend**:
    ```bash
    cd frontend
    npm install
    npm start
    ```
