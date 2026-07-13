# 🛍️ Smail Store - Moroccan E-Commerce Platform

A modern, high-performance e-commerce platform built for Moroccan fashion retailers. Complete with AI-powered admin dashboard, real-time analytics, and multi-channel conversion tracking.

**Live Demo:** [smailstore.shop](https://smailstore.shop)  
**GitHub:** [afdadenhamza-coder/smail-store-project](https://github.com/afdadenhamza-coder/smail-store-project)

---

## ✨ Features

### 🏪 Frontend (Next.js + React)
- ⚡ **Lightning-fast** product browsing with collections
- 🛒 **Smooth checkout** flow optimized for mobile
- 🎯 **Conversion optimization** - Upsell products, social proof, urgency timers
- 📱 **Mobile-first** responsive design
- 🌍 **Multi-language** support (Arabic/French)
- 💳 **Multiple payment methods** (COD, cards, etc.)
- 📊 **Pixel tracking** - Meta, TikTok, Snapchat integration

### 👨‍💼 Admin Dashboard
- 📈 **Real-time analytics** - Orders, revenue, traffic stats
- 📦 **Complete product management** - CRUD operations
- 🧮 **Profit calculator** - Calculate margins with all costs
- 📋 **Order tracking** - Status updates, customer management
- 🔐 **Secure authentication** - Admin login system
- 📊 **Performance metrics** - Conversion rates, AOV, etc.

### 🔧 Backend (FastAPI + PostgreSQL)
- ⚡ **Async/await** architecture for high performance
- 🔒 **Secure API** with authentication
- 📡 **Webhook support** for order processing
- 🌐 **CORS enabled** for multi-domain support
- 📊 **Database migrations** with Alembic
- 🚀 **Production-ready** error handling

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Animation:** Framer Motion
- **Charts:** Recharts
- **Language:** TypeScript

### Backend
- **Framework:** FastAPI
- **Database:** PostgreSQL + SQLAlchemy
- **Async:** AsyncIO + AsyncPG
- **Migrations:** Alembic
- **Server:** Uvicorn

### Deployment
- **Frontend:** Vercel (Free)
- **Backend:** Render.com / Railway.app
- **Database:** Neon / Supabase (Free PostgreSQL)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- PostgreSQL (or use free cloud database)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/afdadenhamza-coder/smail-store-project.git
cd smail-store-project
```

### 2. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp ../.env.example .env
# Edit .env with your database URL

# Run migrations
alembic upgrade head

# Seed initial data
python seed.py

# Start server
uvicorn app.main:app --reload
```

Backend runs at: `http://localhost:8000`

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_META_PIXEL_ID=your_pixel_id
NEXT_PUBLIC_TIKTOK_PIXEL_CODE=your_code
NEXT_PUBLIC_SNAPCHAT_PIXEL_ID=your_id
EOF

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:3000`

### 4. Access Admin Dashboard

```
URL: http://localhost:3000/admin/login
Email: admin@smailstore.shop
Password: change-me-admin-password
```

---

## 📁 Project Structure

```
smail-store-project/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # FastAPI app setup
│   │   ├── config.py       # Configuration
│   │   ├── database.py     # DB connection
│   │   ├── models/         # SQLAlchemy models
│   │   ├── routers/        # API endpoints
│   │   ├── schemas/        # Pydantic models
│   │   └── services/       # Business logic
│   ├── alembic/            # DB migrations
│   ├── seed.py             # Initial data
│   └── requirements.txt
│
├── frontend/               # Next.js frontend
│   ├── app/
│   │   ├── page.tsx       # Home page
│   │   ├── admin/         # Admin dashboard
│   │   ├── product/       # Product pages
│   │   └── checkout/      # Checkout flow
│   ├── components/        # React components
│   ├── lib/              # Utilities & API
│   └── public/           # Static assets
│
├── docs/                  # Documentation
├── docker-compose.yml    # Local dev environment
├── DEPLOYMENT.md         # Deployment guide
└── README.md            # This file
```

---

## 🌐 API Endpoints

### Products
- `GET /api/products` - List all active products
- `GET /api/products/{id}` - Get product details
- `GET /api/admin/products` - List all products (admin)
- `POST /api/admin/products` - Create product (admin)
- `PUT /api/admin/products/{id}` - Update product (admin)
- `DELETE /api/admin/products/{id}` - Delete product (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/admin/orders` - List orders (admin)
- `GET /api/admin/orders/{id}` - Get order details (admin)
- `PUT /api/admin/orders/{id}/status` - Update status (admin)

### Admin
- `POST /api/admin/login` - Login
- `POST /api/admin/logout` - Logout
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/stats/detailed` - Detailed analytics
- `POST /api/admin/profit/calculate` - Calculate profit

---

## 🔐 Security

- ✅ Admin authentication with JWT tokens
- ✅ CORS protection
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ Secure password hashing
- ✅ Environment variables for secrets
- ✅ HTTPS ready

---

## 📊 Database Schema

### Products Table
- `id` (UUID)
- `name` (String) - Product name
- `slug` (String) - URL-friendly slug
- `price` (Decimal) - Base price
- `offer_price` (Decimal) - Sale price
- `description` (Text)
- `images` (JSON) - Array of image URLs
- `category` (String)
- `is_active` (Boolean)
- `is_featured` (Boolean)
- `is_upsell` (Boolean)
- `rating` (Decimal)
- `reviews_count` (Integer)

### Orders Table
- `id` (UUID)
- `order_number` (String)
- `customer_name` (String)
- `customer_phone` (String)
- `items` (JSON) - Order items
- `total` (Decimal)
- `status` (String) - pending, confirmed, shipped, delivered, etc.
- `created_at`, `updated_at` (DateTime)

---

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy:**
1. Push to GitHub ✓ (Already done)
2. Deploy frontend to Vercel
3. Deploy backend to Render.com / Railway
4. Set environment variables
5. Configure custom domain
6. Live! 🎉

---

## 🧪 Testing

### Backend
```bash
cd backend
pytest
```

### Frontend
```bash
cd frontend
npm test
```

---

## 📝 Environment Variables

See [.env.example](./.env.example) for the complete list.

**Key variables:**
```
DATABASE_URL=postgresql://user:pass@localhost/dbname
NEXT_PUBLIC_API_URL=http://localhost:8000
SECRET_KEY=your-secret-key
ADMIN_EMAIL=admin@smailstore.shop
ADMIN_PASSWORD=secure-password
```

---

## 🐛 Troubleshooting

### API Connection Issues
- Ensure backend is running
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify CORS_ORIGINS includes your domain

### Database Connection Failed
- Check `DATABASE_URL` format
- Verify PostgreSQL is running
- Check firewall rules

### Build Fails on Vercel
- Clear build cache
- Check Node.js version
- Verify environment variables

---

## 📖 Documentation

- [Architecture](./docs/01-architecture.md)
- [API Specification](./docs/05-backend-api.md)
- [Database Schema](./docs/06-database-schema.md)
- [Deployment Guide](./DEPLOYMENT.md)

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and create a pull request

---

## 📄 License

This project is proprietary. All rights reserved.

---

## 👤 Author

**Afdaden Hamza**
- GitHub: [@afdadenhamza-coder](https://github.com/afdadenhamza-coder)
- Email: afdadenhamza@gmail.com

---

## 🎯 Roadmap

- [ ] Payment gateway integration (Stripe, Payfort)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] AI product recommendations
- [ ] Inventory management
- [ ] Multi-warehouse support
- [ ] B2B portal
- [ ] Mobile app (React Native)

---

## 💰 Support

If this project helped you, consider:
- ⭐ Starring the repository
- 📢 Sharing with others
- 💬 Providing feedback

---

**Built with ❤️ for Moroccan businesses**
