import { hash, compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { regusers } from "../dummyDB.js";
import {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} from "../tokens.js";

export const registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = regusers.find((u) => u.username === username);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Username already taken! Try again.",
      });
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
  } catch (err) {
    res.status(500).send("Error while registering, please try again!");
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = regusers.find((user) => user.username === username);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: `Invalid credentials!` });

    const isPwdValid = await compare(password, user.password);
    if (!isPwdValid)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials!" });

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    user.refreshToken = refreshToken;

    sendRefreshToken(res, refreshToken);
    sendAccessToken(req, res, accessToken);
  } catch (error) {
    res.status(500).send("Error while logging in");
  }
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
