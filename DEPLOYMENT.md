# Smail Store - Deployment Guide

## 🚀 Quick Deployment Instructions

This guide will help you deploy the Smail Store project to Vercel for free.

### Prerequisites

- GitHub account (already done ✓)
- Vercel account (free at https://vercel.com)
- Backend API deployed (separate from frontend)

---

## 📋 Part 1: Database & Backend Deployment on Render

### Step 1: Create PostgreSQL Database on Render

1. **Go to Render.com** - https://render.com
2. **Sign up with GitHub** (use your GitHub account)
3. **Create New** → **PostgreSQL**
4. **Fill in the details:**
   - **Name:** `smail-store-db` (or any name you like)
   - **Database:** `smail` (important - this is the database name)
   - **User:** `postgres` (default)
   - **Region:** Choose closest to you (e.g., `us-east`)
   - **Keep everything else as default**
5. **Click Create Database** and wait 1-2 minutes
6. **Copy the connection string:**
   - Once created, go to the database dashboard
   - Find **"Internal Database URL"** (NOT External URL - we use Internal since backend is also on Render)
   - Copy it - it should look like: `postgresql://user:password@hostname:5432/smail`
   - **⚠️ Important:** Change `postgresql://` to `postgresql+asyncpg://` at the start
   - **Final URL example:** `postgresql+asyncpg://user:password@hostname:5432/smail`
7. **Save this URL** - You'll need it for the backend

---

### Step 2: Deploy Backend Web Service on Render

1. **In Render Dashboard** → **Create New** → **Web Service**
2. **Connect GitHub:**
   - Click "Connect your repo"
   - Find and select `smail-store-project`
3. **Configure Web Service:**
   - **Name:** `smail-store-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port 8000`
4. **Add Environment Variables:**
   - Click **Advanced** → **Add Environment Variable**
   - Add each variable below:
     ```
     DATABASE_URL=<paste the URL you copied from database step>
     APP_ENV=production
     SECRET_KEY=<generate 32+ random characters - use: openssl rand -hex 32>
     CORS_ORIGINS=https://your-vercel-domain.vercel.app,http://localhost:3000
     ADMIN_EMAIL=admin@smailstore.shop
     ADMIN_PASSWORD=<create a strong password>
     META_PIXEL_ID=your_pixel_id
     META_ACCESS_TOKEN=your_token
     TIKTOK_PIXEL_CODE=your_code
     TIKTOK_ACCESS_TOKEN=your_token
     SNAPCHAT_PIXEL_ID=your_id
     SNAPCHAT_ACCESS_TOKEN=your_token
     ```
5. **Click Deploy**
6. **Wait for deployment** (usually 3-5 minutes)
7. **Copy your backend URL** from the Render dashboard (it will be something like `https://smail-store-backend.onrender.com`)

---

## 🎨 Part 2: Frontend Deployment on Vercel

### Step 1: Connect Vercel to GitHub

1. Go to https://vercel.com
2. Click **"Add New..."** → **Project**
3. Select your GitHub account and import `smail-store-project` repository
4. Choose **Next.js** as framework
5. Set the root directory to `frontend`

### Step 2: Configure Environment Variables

In Vercel dashboard, go to **Settings → Environment Variables** and add:

```
NEXT_PUBLIC_API_URL=https://smail-store-backend.onrender.com
NEXT_PUBLIC_META_PIXEL_ID=your_meta_pixel_id
NEXT_PUBLIC_TIKTOK_PIXEL_CODE=your_tiktok_code
NEXT_PUBLIC_SNAPCHAT_PIXEL_ID=your_snapchat_id
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

**Replace:**
- `smail-store-backend.onrender.com` with your actual backend URL from Render
- Other IDs with your actual tracking IDs

### Step 3: Deploy

1. Click **Deploy**
2. Wait for build to complete (usually 1-2 minutes)
3. Your site is now live! 🎉

---

## ✅ Checklist Before Deployment

- [ ] Backend URL from Render copied
- [ ] NEXT_PUBLIC_API_URL set in Vercel
- [ ] All environment variables set on Render
- [ ] Database created on Render
- [ ] Admin credentials set (ADMIN_EMAIL, ADMIN_PASSWORD)

---

---

## 📝 Quick Reference: What Each Variable Does

| Variable | What it is | Where to get it |
|----------|-----------|-----------------|
| `DATABASE_URL` | Database connection string | Render PostgreSQL dashboard |
| `SECRET_KEY` | Secret for sessions/tokens | Generate: `openssl rand -hex 32` |
| `ADMIN_EMAIL` | Email to login to admin | You decide (e.g., your email) |
| `ADMIN_PASSWORD` | Password to login to admin | You decide (make it strong) |
| `CORS_ORIGINS` | Allowed websites | Your Vercel frontend URL |
| Other tracking IDs | For analytics (optional) | Meta, TikTok, Snapchat accounts |

---

## ✅ Admin Dashboard Access

After deployment:

1. Visit: `https://your-domain.vercel.app/admin/login`
2. Login with credentials from backend environment variables
3. Manage products, orders, and analytics

---

## 📱 Features Available

✅ **Product Management**

- Create, read, update, delete products
- Add multiple product images
- Set prices and offers
- Manage categories and sizes

✅ **Admin Dashboard**

- Real-time analytics and stats
- Order tracking
- Profit calculator
- Click tracking

✅ **E-commerce**

- Product listings
- Shopping cart
- Checkout flow
- Order processing

---

## 🐛 Troubleshooting

### Build fails on Vercel

- Check that `NEXT_PUBLIC_API_URL` is set correctly
- Ensure frontend build script is correct
- Clear build cache and retry

### API calls fail

- Check backend URL in `NEXT_PUBLIC_API_URL`
- Verify CORS_ORIGINS includes your Vercel domain
- Check backend environment variables

### Database connection fails

- Verify `DATABASE_URL` format
- Ensure database is running
- Check firewall/network rules

---

## 📞 Support

For issues:

1. Check backend logs in Render/Railway dashboard
2. Check frontend logs in Vercel dashboard
3. Verify all environment variables are set
4. Test API manually using Postman/Thunder Client

---

## 🎯 Next Steps After Deployment

1. ✅ Set up SSL certificate (automatic on Vercel)
2. ✅ Configure custom domain
3. ✅ Set up email notifications
4. ✅ Configure payment processing
5. ✅ Monitor analytics and performance

Congratulations! Your Smail Store is now deployed! 🎉
