# 🚀 دليل النشر الكامل — Smail Store

## نظرة عامة على البنية

```
Frontend (Next.js)  ──►  Vercel (مجاني)
Backend (FastAPI)   ──►  Railway أو Render (مجاني/مدفوع)
Database (PostgreSQL)──► Railway أو Supabase (مجاني)
```

---

## الخطوة 1 — نشر قاعدة البيانات (PostgreSQL)

### الخيار الأفضل: Railway

1. اذهب إلى [railway.app](https://railway.app) وسجل حساب
2. اضغط **New Project** ← **Add a Service** ← **Database** ← **PostgreSQL**
3. بعد الإنشاء، اضغط على قاعدة البيانات ثم **Variables**
4. احفظ هذا السطر (ستحتاجه لاحقاً):
   ```
   DATABASE_URL=postgresql+asyncpg://postgres:<password>@<host>:5432/railway
   ```
   > ⚠️ ابدل `postgresql://` بـ `postgresql+asyncpg://` لأن FastAPI يحتاجها كذلك

---

## الخطوة 2 — نشر الـ Backend على Railway

### الملفات المطلوبة (موجودة مسبقاً)

- `backend/Dockerfile` ✅
- `backend/requirements.txt` ✅

### الخطوات

1. في نفس مشروع Railway، اضغط **Add a Service** ← **GitHub Repo**
2. اختر مشروعك وحدد **Root Directory**: `backend`
3. في تبويب **Variables**، أضف هذه المتغيرات:

```env
# ⚠️ غيّر هذه القيم بالضرورة
DATABASE_URL=postgresql+asyncpg://postgres:<password>@<railway-host>:5432/railway
SECRET_KEY=<اكتب كلمة سر عشوائية طويلة — مثال: x8k2m9p4q7w1n3j6>
ADMIN_EMAIL=<بريدك الإلكتروني>
ADMIN_PASSWORD=<كلمة سر قوية للوحة التحكم>

# CORS — سيتم تحديثه بعد نشر الفرونت
CORS_ORIGINS=http://localhost:3000,https://your-vercel-domain.vercel.app

# اختيارية — للتتبع والتسويق
META_PIXEL_ID=
META_ACCESS_TOKEN=
META_TEST_EVENT_CODE=
TIKTOK_PIXEL_CODE=
TIKTOK_ACCESS_TOKEN=
SNAPCHAT_PIXEL_ID=
SNAPCHAT_ACCESS_TOKEN=
GOOGLE_SHEETS_WEBHOOK_URL=

APP_ENV=production
```

4. Railway سيبني ويشغل الـ backend تلقائياً
5. بعد النشر، ستحصل على URL مثل: `https://smail-backend.up.railway.app`

---

## الخطوة 3 — نشر الـ Frontend على Vercel

### إعداد المشروع

1. اذهب إلى [vercel.com](https://vercel.com) وسجل بحساب GitHub
2. اضغط **Add New Project**
3. اختر repo الخاص بك
4. في **Configure Project**:
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js (يُكتشف تلقائياً)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. في **Environment Variables**، أضف:

```env
NEXT_PUBLIC_API_URL=https://smail-backend.up.railway.app
NEXT_PUBLIC_SITE_URL=https://smailstore.vercel.app

# اختيارية
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_CODE=
NEXT_PUBLIC_SNAPCHAT_PIXEL_ID=
```

6. اضغط **Deploy** — Vercel سينشر تلقائياً

---

## الخطوة 4 — تحديث CORS بعد النشر

بعد الحصول على URL الـ Vercel، ارجع لـ Railway وحدّث:

```env
CORS_ORIGINS=https://smailstore.vercel.app,https://smailstore.shop
```

> إذا عندك دومين خاص، أضفه هنا أيضاً

---

## الخطوة 5 — تهيئة قاعدة البيانات

بعد نشر الـ backend، شغّل هذا الأمر مرة واحدة لإنشاء الجداول والبيانات الأولية:

```bash
# في Railway Terminal أو عبر الـ API
curl -X POST https://smail-backend.up.railway.app/api/admin/seed
```

أو عبر Railway CLI:

```bash
railway run python seed.py
```

---

## الخطوة 6 — ربط دومين خاص (اختياري)

### على Vercel:

1. Settings → Domains → أضف دومينك `smailstore.shop`
2. أضف DNS records حسب تعليمات Vercel

### على Railway:

1. Settings → Networking → Custom Domain
2. أضف `api.smailstore.shop`

---

## ⚠️ الملفات والإعدادات التي يجب تغييرها قبل النشر

| الملف       | المتغير               | القيمة الحالية             | يجب تغييرها إلى             |
| ----------- | --------------------- | -------------------------- | --------------------------- |
| Railway env | `ADMIN_EMAIL`         | `admin@smailstore.shop`    | بريدك الحقيقي               |
| Railway env | `ADMIN_PASSWORD`      | `change-me-admin-password` | كلمة سر قوية (12+ حرف)      |
| Railway env | `SECRET_KEY`          | `change-me`                | نص عشوائي طويل              |
| Railway env | `DATABASE_URL`        | localhost URL              | Railway PostgreSQL URL      |
| Vercel env  | `NEXT_PUBLIC_API_URL` | `http://localhost:8000`    | URL الـ backend على Railway |

---

## ملاحظات مهمة

### لوحة التحكم Admin

- الرابط: `https://smailstore.vercel.app/admin/login`
- البريد: ما تضعه في `ADMIN_EMAIL`
- كلمة السر: ما تضعه في `ADMIN_PASSWORD`

### إذا الـ backend لم يشتغل

تأكد أن:

1. `DATABASE_URL` صحيح (يبدأ بـ `postgresql+asyncpg://`)
2. PostgreSQL service شغّال في Railway
3. الـ Dockerfile في مسار `backend/` صحيح

### Static Files (صور المنتجات)

الصور محفوظة في `frontend/public/images/`. بما أن Vercel يستضيف الملفات الثابتة تلقائياً، الصور ستعمل بشكل طبيعي.

للصور الجديدة المرفوعة من لوحة التحكم، ستحتاج لتكوين cloud storage (مثل Cloudinary أو Supabase Storage). حالياً تُحفظ في `backend/uploads/` وهذا لا يستمر بعد restart في Railway.

---

## خلاصة قائمة التحقق ✅

- [ ] إنشاء قاعدة بيانات PostgreSQL على Railway
- [ ] نشر الـ backend على Railway مع المتغيرات الصحيحة
- [ ] تغيير `ADMIN_EMAIL` و `ADMIN_PASSWORD` و `SECRET_KEY`
- [ ] نشر الـ frontend على Vercel
- [ ] إضافة `NEXT_PUBLIC_API_URL` على Vercel
- [ ] تحديث `CORS_ORIGINS` على Railway بـ URL الـ Vercel
- [ ] تشغيل seed لقاعدة البيانات
- [ ] التحقق من عمل الطلبات من الموقع
- [ ] التحقق من دخول لوحة التحكم
