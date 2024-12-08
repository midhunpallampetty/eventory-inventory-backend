import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../types/user";

// Generate an access token
export const generateAccessToken = (user: Partial<User>): string => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined in environment variables.");
  }
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

// Generate a refresh token
export const generateRefreshToken = (user: Partial<User>): string => {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET is not defined in environment variables.");
  }
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

// Verify a token
export const verifyToken = (token: string, secret: string): JwtPayload | string => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new Error("Invalid or expired token.");
  }
};
