export const ENV = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001",
  IS_DEV: process.env.EXPO_PUBLIC_ENVIRONMENT === "development",
};
