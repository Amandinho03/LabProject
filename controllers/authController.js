import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { regusers } from "../dummyDB.js";
import { AppError } from "../utils/AppError.js";
import {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} from "../tokens.js";

export const registerUser = async (req, res) => {
  const { username, password } = req.body;

  const existing = regusers.find((u) => u.username === username);
  if (existing) {
    throw new AppError("Username already taken! Try again.", 400);
  }

  const hashedpwd = await hash(password, 10);
  const newUser = {
    id: regusers.length + 1,
    username: username,
    password: hashedpwd,
    role: "user",
  };

  regusers.push(newUser);
  res
    .status(200)
    .json({ success: true, message: `Successfully registered ${username}` });
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const user = regusers.find((user) => user.username === username);
  if (!user) throw new AppError("Invalid credentials!", 404);

  const isPwdValid = await compare(password, user.password);
  if (!isPwdValid) throw new AppError("Invalid credentials!", 400);

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  user.refreshToken = refreshToken;

  sendRefreshToken(res, refreshToken);
  sendAccessToken(req, res, accessToken);
};

export const refreshUserToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.send({ accessToken: "" });

  let payload = null;
  try {
    payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    return res.send({ accessToken: "" });
  }

  const user = regusers.find((user) => user.id === payload.id);
  if (!user || user.refreshToken !== token)
    return res.send({ accessToken: "" });

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  user.refreshToken = refreshToken;

  sendRefreshToken(res, refreshToken);
  return res.send({ accessToken });
};

export const logoutUser = (_req, res) => {
  res.clearCookie("refreshToken", { path: "/refresh_token" });
  return res.send("Successfully Logged Out!");
};
