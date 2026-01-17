import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth";
import { rateLimiter } from "../services/rateLimiter";
import { countWords } from "../utils/justify";

const DAILY_WORD_LIMIT = 80000;

export function rateLimitMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  const token = req.token;
  const text = req.body as string;

  if (!token) {
    res.status(401).json({ error: "Token requis" });
    return;
  }

  if (typeof text !== "string" || text.length === 0) {
    res
      .status(400)
      .json({ error: "Le corps doit être du texte (text/plain) non vide" });
    return;
  }

  const wordCount = countWords(text);
  const used = rateLimiter.getUsage(token);

  if (used + wordCount > DAILY_WORD_LIMIT) {
    res.status(402).json({
      error: "Payment Required",
      message: `Limite quotidienne de ${DAILY_WORD_LIMIT} mots dépassée`,
      used,
      requested: wordCount,
      limit: DAILY_WORD_LIMIT,
    });
    return;
  }

  rateLimiter.addUsage(token, wordCount);
  next();
}
