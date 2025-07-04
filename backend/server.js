import express from "express";
import dbConnect from "./db/dbConnect.js";
import config from "./config/config.js";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { userRouter } from "./routes/userRoutes.js";
import docRouter from "./routes/docRoutes.js";
import signatureRouter from "./routes/signatureRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";

import path from "path";

const app = express();

app.use(express.json({ limit: "1MB" }));
app.use(express.urlencoded({ limit: "1MB", extended: true }));
app.use(cookieParser());

// ✅ Add CORS headers manually for static files (MUST be above static middleware)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173", "https://doc-sign-khaki.vercel.app/");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// ✅ Serve PDF uploads with correct CORS headers
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// ✅ CORS for API routes
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
}));

// Routes
app.use("/api/user", userRouter);
app.use("/api/docs", docRouter);
app.use("/api/signatures", signatureRouter);
app.use("/api/audit", auditRoutes);

// Test route
app.use("/", (req, res) => {
  res.status(200).json({ message: "API is working" });
});

// Error handling middleware
app.use(errorHandler);

// DB Connect + Start Server
dbConnect().then(() => {
  const PORT = config.PORT;
  app.listen(PORT, () => {
    console.log(`App is listening at port`, PORT);
  });
}).catch((error) => {
  console.log(`MongoDB error!!`, error);
});
