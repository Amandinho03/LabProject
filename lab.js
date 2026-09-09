//MODULES
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import experimentRoutes from "./routes/experiments.js";
import authRoutes from "./routes/auth.js";
import configRoutes from "./routes/configRoutes.js";

const lab = express();
const PORT = process.env.PORT;

//MIDDLEWARE
lab.use(cookieParser());
lab.use(express.json());
lab.use(express.urlencoded({ extended: true }));
lab.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

lab.use(express.static("public", { extensions: ["html"] }));
lab.use("/api/experiments", experimentRoutes);
lab.use("/", authRoutes);
lab.use("/", configRoutes);

// global error handling
lab.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const message = err.isOperational
    ? err.message
    : "Internal Server Error! Please try again.";

  if (!err.isOperational) {
    console.error("CRITICAL ERROR!:", err);
  }

  res.status(statusCode).json({
    success: false,
    message: message,
  });
});

//start server
lab.listen(process.env.PORT, () => {
  console.log(
    `Lab Server is listening on http://localhost:${process.env.PORT}`,
  );
});
