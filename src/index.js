import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import pool from "./config/db.js";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/userRoutes.js";
import errorHandling from "./middlewares/errorHandler.js";
import { createTables } from "./data/tableCreation.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Resolve paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("combined"));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies
  })
);
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'","*"],
      connectSrc: ["'self'","*"],
    },
  })
);
app.use(
  rateLimit({
    windowMs: 1500 * 60 * 1000, // 15 minutes
    max: 1000000, // Limit each IP to 100 requests per window
    message: "Too many requests from this IP, please try again later.",
  })
);

// Routes
app.use("/api/v1/user", userRoutes);



// Serve React frontend build
const buildPath = path.join(__dirname, "dist");
app.use(express.static(buildPath));

// SPA fallback for React routing
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// Error handling middleware
app.use(errorHandling);
app.use((err, req, res, next) => {
  if (err instanceof Error && err.code) {
    console.error("Database error:", err);
    res.status(500).json({ message: "A database error occurred" });
  } else {
    next(err);
  }
});

// Database setup and server start
(async () => {
  try {
    // await pool.connect();
    // await pool.promise().query('SELECT 1');
    console.log("Database connected successfully.");
    await createTables();
    console.log("Database setup completed.");

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error during database setup:", error.message);
    process.exit(1);
  } 
})();
