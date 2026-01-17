import express, { Request, Response, NextFunction } from "express";
import { justifyText } from "./utils/justify";
import { tokenStore } from "./services/tokenStore";
import { authenticateToken } from "./middleware/auth";
import { rateLimitMiddleware } from "./middleware/rateLimit";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/justify", express.text({ type: "text/plain" }));

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/", (_req: Request, res: Response) => {
  res.send(
    "Bienvenue à l'API de justification de texte. Utilisez /api/token pour obtenir un token et /api/justify pour justifier du texte.",
  );
});

app.post("/api/token", (req: Request, res: Response) => {
  const { email } = req.body || {};
  if (!email || typeof email !== "string") {
    res.status(400).json({ error: "Email requis dans le body JSON" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: "Format d'email invalide" });
    return;
  }

  const token = tokenStore.generateToken(email);
  res.json({ token });
});

app.post(
  "/api/justify",
  authenticateToken,
  rateLimitMiddleware,
  (req: Request, res: Response) => {
    if (typeof req.body !== "string") {
      res.status(400).json({ error: "Corps attendu: text/plain" });
      return;
    }

    const justified = justifyText(req.body);
    res.type("text/plain").send(justified);
  },
);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route non trouvée" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Erreur interne du serveur" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;
