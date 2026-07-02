import type { NextFunction, Request, Response } from "express";

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const key = req.headers["x-api-key"];
  const expected = process.env.BACKEND_API_KEY;

  if (!expected) {
    return res.status(500).json({ success: false, error: "API key not configured" });
  }

  if (!key || key !== expected) {
    return res.status(401).json({ success: false, error: "Invalid API key" });
  }

  next();
};
