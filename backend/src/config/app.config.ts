export const appConfig = () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  cdnUrl: process.env.CDN_URL || `http://localhost:3001/cdn`,
  secretKey: process.env.SECRET_KEY || "miniread-secret-key-2026-auth-token-key-32",
  databaseUrl: process.env.DATABASE_URL,
});
