# Smail Store - Deployment Guide

## 🚀 Quick Deployment Instructions

This guide will help you deploy the Smail Store project to Vercel for free.

### Prerequisites
- GitHub account (already done ✓)
- Vercel account (free at https://vercel.com)
- Backend API deployed (separate from frontend)

---

## 📋 Part 1: Backend Deployment

### Option A: Deploy Backend on Render.com (Free)

1. **Push backend to GitHub** (already done)
2. **Go to Render.com** - https://render.com
3. **Sign up with GitHub** and connect your repository
4. **Create New → Web Service**
   - Select your `smail-store-project` repository
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt && alembic upgrade head`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port 10000`
   - Environment Variables (add these):
     ```
     DATABASE_URL=<PostgreSQL connection string from Render>
     APP_ENV=production
     SECRET_KEY=<generate secure random string>
     CORS_ORIGINS=https://your-vercel-domain.vercel.app
     ADMIN_EMAIL=admin@smailstore.shop
     ADMIN_PASSWORD=<secure password>
     META_PIXEL_ID=your_pixel_id
     META_ACCESS_TOKEN=your_token
     TIKTOK_PIXEL_CODE=your_code
     TIKTOK_ACCESS_TOKEN=your_token
     SNAPCHAT_PIXEL_ID=your_id
     SNAPCHAT_ACCESS_TOKEN=your_token
     ```

5. **Note the backend URL** - You'll need this for the frontend

### Option B: Deploy Backend on Railway.app

1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project
4. Follow similar steps as Render
5. Set environment variables

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
NEXT_PUBLIC_API_URL=https://your-backend-url.render.com
NEXT_PUBLIC_META_PIXEL_ID=your_meta_pixel_id
NEXT_PUBLIC_TIKTOK_PIXEL_CODE=your_tiktok_code
NEXT_PUBLIC_SNAPCHAT_PIXEL_ID=your_snapchat_id
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

Replace:
- `your-backend-url.render.com` - Your Render backend URL
- `your_meta_pixel_id` - Your Meta pixel ID
- Other pixel/tracking IDs as needed

### Step 3: Deploy

1. Click **Deploy**
2. Wait for build to complete (usually 1-2 minutes)
3. Your site is now live! 🎉

---

## 🔧 Environment Variables Setup

### Frontend (.env.local in Vercel)
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_SITE_URL` - Frontend URL
- `NEXT_PUBLIC_META_PIXEL_ID` - Meta/Facebook tracking
- `NEXT_PUBLIC_TIKTOK_PIXEL_CODE` - TikTok tracking
- `NEXT_PUBLIC_SNAPCHAT_PIXEL_ID` - Snapchat tracking

### Backend (Railway/Render)
- `DATABASE_URL` - PostgreSQL connection
- `SECRET_KEY` - Random secret for tokens
- `CORS_ORIGINS` - Allow your Vercel domain
- `ADMIN_EMAIL` & `ADMIN_PASSWORD` - Admin credentials
- All tracking pixel IDs and tokens

---

## 🗄️ Database Setup

### Option 1: PostgreSQL on Neon.tech (Free)
1. Go to https://neon.tech
2. Sign up with GitHub
3. Create new project
4. Copy connection string
5. Set as `DATABASE_URL` in backend environment

### Option 2: Supabase (Free PostgreSQL)
1. Go to https://supabase.com
2. Create new project
3. Get connection string
4. Set as `DATABASE_URL`

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
