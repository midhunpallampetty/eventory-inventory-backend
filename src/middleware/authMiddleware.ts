import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access token required" });
    return;
  }

  try {
    const user = verifyToken(token, process.env.ACCESS_TOKEN_SECRET as string);
    req.body.user = user;
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
};
