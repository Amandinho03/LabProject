import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { DBUser } from "./dummyDB.js";

const createAccessToken = (user: DBUser) =>
  jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "1h" },
  );

const createRefreshToken = (user: DBUser) =>
  jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" },
  );

const sendAccessToken = (req: Request, res: Response, accesstoken: string) => {
  res
    .status(200)
    .json({ success: true, accesstoken, username: req.body.username });
};

const sendRefreshToken = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/refresh_token",
  });
};

export {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
};