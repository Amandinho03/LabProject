import { Request, Response } from "express";
import { AuthService } from "../services/AuthService.js";
import { sendAccessToken, sendRefreshToken } from "../tokens.js";

export const registerUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  await AuthService.registerUser(username, password);

  res
    .status(201)
    .json({ success: true, message: `Successfully registered ${username}` });
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const { accessToken, refreshToken } = await AuthService.loginUser(
    username,
    password,
  );

  sendRefreshToken(res, refreshToken);
  sendAccessToken(req, res, accessToken);
};

export const refreshUserToken = (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  const tokens = AuthService.refreshUserToken(token);

  if (!tokens) {
    return res.send({ accessToken: "" });
  }

  sendRefreshToken(res, tokens.refreshToken);
  return res.send({ accessToken: tokens.accessToken });
};

export const logoutUser = (req: Request, res: Response) => {
  AuthService.logoutUser(req.cookies.refreshToken);
  res.clearCookie("refreshToken", { path: "/refresh_token" });
  return res.status(200).json({ success: true, message: "Successfully Logged Out!" });
};