import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';

dotenv.config();

const app = express();
const MONGO_URI = process.env.MONGO_URI;

// ─── MongoDB ulanishini keshlash (Vercel serverless uchun muhim) ──────────────
// Vercel har so'rovda yangi container ishlatishi mumkin.
// Shuning uchun ulanish holati keshlanadi va har so'rovda tekshiriladi.
let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) return;

  if (!MONGO_URI) {
    throw new Error('MONGO_URI muhit o\'zgaruvchisi aniqlanmagan!');
  }

  await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000, // 10 soniya kutish
    socketTimeoutMS: 45000,
  });

  isConnected = true;
  console.log('✅ MongoDB ga ulandi');
}

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Har bir so'rovdan oldin DB ulanishini ta'minlash
app.use(async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err: any) {
    console.error('❌ DB ulanish xatosi:', err.message);
    res.status(500).json({ error: 'Ma\'lumotlar bazasiga ulanib bo\'lmadi' });
  }
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', apiRoutes);

app.get('/', (_req, res) => {
  res.send('PUBG Tournament API ishlayapti ✅');
});

// ─── Mahalliy server (faqat localhost uchun) ──────────────────────────────────
const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 Server http://localhost:${PORT} da ishlamoqda`);
      });
    })
    .catch((err) => {
      console.error('❌ Server ishga tushirish xatosi:', err.message);
    });
}

export default app;
