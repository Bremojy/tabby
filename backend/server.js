import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import productRoutes from "./routes/productRoutes.js";
import salesRoutes from "./routes/salesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

// Connect DB safely (avoid crash if DB fails)
connectDB();

const app = express();

/* =======================
   MIDDLEWARE
======================= */

// Allow frontend (Vercel + local dev)
const allowedOrigins = [
  "http://localhost:5173",
  "https://tabby-swart.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Blocked by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

/* =======================
   ROUTES
======================= */

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", salesRoutes);

/* Health check route */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Tabby POS Backend Running",
  });
});

/* =======================
   SERVER START
======================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});