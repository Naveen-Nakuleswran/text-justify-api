interface UsageData {
  count: number;
  date: string;
}

class RateLimiter {
  private usage: Map<string, UsageData> = new Map();

  private today(): string {
    return new Date().toISOString().split("T")[0];
  }

  getUsage(token: string): number {
    const date = this.today();
    const data = this.usage.get(token);
    if (!data || data.date !== date) {
      return 0;
    }
    return data.count;
  }

  addUsage(token: string, wordCount: number): void {
    const date = this.today();
    const data = this.usage.get(token);
    if (!data || data.date !== date) {
      this.usage.set(token, { count: wordCount, date });
    } else {
      data.count += wordCount;
    }
  }

  cleanup(): void {
    const date = this.today();
    for (const [token, data] of this.usage.entries()) {
      if (data.date !== date) {
        this.usage.delete(token);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

setInterval(() => rateLimiter.cleanup(), 60 * 60 * 1000);
