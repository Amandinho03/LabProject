import { hash, compare } from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository.js";
import { AppError } from "../utils/AppError.js";
import { createAccessToken, createRefreshToken } from "../tokens.js";
import { DBUser } from "../dummyDB.js";

export class AuthService {
  static async registerUser(username: string, password: string): Promise<DBUser> {
    const existing = UserRepository.findByUsername(username);
    if (existing) {
      throw new AppError("Username already taken! Try again.", 400);
    }

    const hashedpwd = await hash(password, 10);
    const newUser: DBUser = {
      id: UserRepository.getCount() + 1,
      username: username,
      password: hashedpwd,
      role: "user",
    };

    return UserRepository.create(newUser);
  }

  static async loginUser(username: string, password: string) {
    const user = UserRepository.findByUsername(username);
    if (!user) throw new AppError("Invalid credentials!", 404);

    const isPwdValid = await compare(password, user.password as string);
    if (!isPwdValid) throw new AppError("Invalid credentials!", 400);

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    user.refreshToken = refreshToken;

    return { user, accessToken, refreshToken };
  }

  static refreshUserToken(token: string) {
    if (!token) return null;

    let payload: string | JwtPayload | null = null;
    try {
      payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
    } catch (error) {
      return null;
    }

    // Ensure payload is an object before accessing .id
    if (!payload || typeof payload === "string") return null;

    const user = UserRepository.findById(payload.id);
    if (!user || user.refreshToken !== token) return null;

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    user.refreshToken = refreshToken;

    return { accessToken, refreshToken };
  }
  static logoutUser(token?: string): void {
    if (!token) return;
    try {
      const payload = jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET as string,
      );
      if (payload && typeof payload !== "string") {
        const user = UserRepository.findById(payload.id);
        if (user && user.refreshToken === token) {
          user.refreshToken = undefined;
        }
      }
    } catch {
      // Ignore invalid/expired token on logout
    }
  }
}