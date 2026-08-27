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

// global error
lab.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error! Please try again.",
  });
});

//start server
lab.listen(process.env.PORT, () => {
  console.log(
    `Lab Server is listening on http://localhost:${process.env.PORT}`,
  );
});
