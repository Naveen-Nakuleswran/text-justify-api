import crypto from "crypto";

interface TokenData {
  email: string;
  createdAt: Date;
}

class TokenStore {
  private tokens: Map<string, TokenData> = new Map();

  generateToken(email: string): string {
    const token = crypto.randomBytes(32).toString("hex");
    this.tokens.set(token, { email, createdAt: new Date() });
    return token;
  }

  isValidToken(token: string): boolean {
    return this.tokens.has(token);
  }

  getTokenData(token: string): TokenData | undefined {
    return this.tokens.get(token);
  }
}

export const tokenStore = new TokenStore();
