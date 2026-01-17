import { Request, Response, NextFunction } from "express";
import { tokenStore } from "../services/tokenStore";

export interface AuthRequest extends Request {
  token?: string;
}

export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  const header = req.header("authorization");
  const token = header && header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: "Token manquant." });
    return;
  }

  if (!tokenStore.isValidToken(token)) {
    res.status(401).json({ error: "Token invalide" });
    return;
  }

  req.token = token;
  next();
}
