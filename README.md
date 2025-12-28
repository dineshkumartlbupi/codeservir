# CodeServir - AI Chatbot Generator SaaS

A complete, production-ready SaaS platform that allows website owners to create AI-powered chatbots instantly without any login or signup required.

## 🚀 Features

### Core Features
- **No Login Required**: Create chatbots instantly without authentication
- **AI-Powered**: Uses OpenAI GPT-4 with RAG (Retrieval-Augmented Generation)
- **Website Scraping**: Automatically extracts content from your website
- **Embed Code**: Copy-paste JavaScript snippet to add chatbot to any website
- **Mobile Integration**: WebView-compatible embed URL for mobile apps
- **Usage Tracking**: Real-time chat count monitoring with Redis caching
- **Subscription Plans**: Free tier + paid plans with automatic enforcement

### Technical Features
- **Vector Database**: Pinecone for semantic search and knowledge retrieval
- **PostgreSQL**: Robust data storage for chatbots, usage, and payments
- **Redis**: High-performance caching for chat counts
- **Payment Integration**: Razorpay (with Stripe alternative)
- **Rate Limiting**: Prevent abuse and ensure fair usage
- **Domain Whitelisting**: Security control for embed usage
- **Tailwind CSS**: Modern, responsive UI design

## 📋 Tech Stack

### Frontend
- React 18+ with TypeScript
- **Tailwind CSS** for styling
- Responsive design for all devices

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL (database)
- Redis (caching)
- Pinecone (vector database)

### AI & ML
- OpenAI GPT-4 Turbo
- LangChain for RAG implementation
- OpenAI Embeddings (text-embedding-ada-002)

### Web Scraping
- Puppeteer for dynamic content
- Cheerio for HTML parsing

### Payment
- Razorpay (primary)
- Stripe (alternative)

## 🛠️ Installation

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Redis 6+
- OpenAI API key
- Pinecone account
- Razorpay/Stripe account (for payments)

### Quick Start

1. **Install Dependencies**
```bash
cd codeservir
npm install --legacy-peer-deps
```

2. **Get API Keys**

📖 **See [API_KEYS_GUIDE.md](./API_KEYS_GUIDE.md) for detailed instructions**

You'll need:
- ✅ OpenAI API Key
- ✅ Pinecone API Key (+ create index)
- ✅ PostgreSQL Database
- ✅ Redis
- ⚠️ Razorpay Keys (optional)

3. **Setup Environment**
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. **Setup Database**
```bash
# Create database
createdb codeservir

# Run schema
psql -d codeservir -f server/database/schema.sql
```

5. **Start Services**
```bash
# Make sure PostgreSQL and Redis are running
brew services start postgresql  # macOS
brew services start redis        # macOS
```

6. **Run the Application**
```bash
# Development mode (runs both frontend and backend)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Widget: http://localhost:5000/widget.js

## 📊 Subscription Plans

| Plan | Price | Chat Limit |
|------|-------|------------|
| Free | ₹0 | 1,000 |
| Basic | ₹999 | 100,000 |
| Pro | ₹1,999 | 1,000,000 |
| Premium | ₹5,999 | 100,000,000 |

## 🔌 Integration

### Website Integration

Add this code to your website's HTML:

```html
<script>
(function () {
  var s = document.createElement("script");
  s.src = "http://localhost:5000/widget.js";
  s.async = true;
  s.setAttribute("data-chatbot-id", "YOUR_CHATBOT_ID");
  document.body.appendChild(s);
})();
</script>
```

### Mobile App Integration

Use this URL in your WebView:

```
http://localhost:5000/embed/YOUR_CHATBOT_ID
```

## 📁 Project Structure

```
codeservir/
├── public/                 # Static files
│   ├── widget.js          # Chat widget script
│   └── embed.html         # Mobile embed page
├── server/                # Backend
│   ├── database/          # Database schemas
│   └── src/
│       ├── config/        # Configuration files
│       ├── controllers/   # Request handlers
│       ├── services/      # Business logic
│       ├── routes/        # API routes
│       └── server.ts      # Express server
├── src/                   # Frontend (React + Tailwind)
│   ├── components/        # React components
│   │   └── LandingPage.tsx
│   ├── App.tsx
│   └── index.tsx
└── package.json
```

## 📝 Documentation

- **[API_KEYS_GUIDE.md](./API_KEYS_GUIDE.md)** - How to get all API keys
- **[QUICKSTART.md](./QUICKSTART.md)** - 10-minute setup guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Complete API reference
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Feature overview

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed production deployment instructions.

Quick deploy options:
- **Frontend**: Vercel, Netlify
- **Backend**: Railway, Heroku, DigitalOcean
- **Database**: Supabase, AWS RDS
- **Redis**: Upstash, Redis Cloud

## 🐛 Troubleshooting

### Common Issues

**Database Connection Issues**
```bash
# Check PostgreSQL is running
pg_isready
```

**Redis Connection Issues**
```bash
# Check Redis is running
redis-cli ping  # Should return: PONG
```

**OpenAI API Errors**
- Verify API key is correct
- Check account has credits
- Ensure model name is correct

**Pinecone Errors**
- Verify API key and environment
- Check index exists: `codeservir-embeddings`
- Ensure dimension is 1536

## 📄 License

MIT License - feel free to use this project for commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using React, Tailwind CSS, and OpenAI**

**Ready to create your first chatbot? Follow the [API_KEYS_GUIDE.md](./API_KEYS_GUIDE.md) to get started! 🚀**
# codeservir-chat-web
