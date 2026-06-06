import { Request } from "express";

export function getCdnUrl(req: Request): string {
  return process.env.CDN_URL || `http://${req.headers.host}/cdn`;
}

export function rewriteCdnUrls<T>(data: T, req: Request): T {
  const cdnUrl = getCdnUrl(req);
  const jsonStr = JSON.stringify(data);
  const replacedStr = jsonStr.replace(/http:\/\/localhost:3001\/cdn/g, cdnUrl);
  return JSON.parse(replacedStr);
}
