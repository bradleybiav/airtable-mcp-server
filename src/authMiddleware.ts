import { Request, Response, NextFunction } from 'express';

export function apiKeyMiddleware(req: Request, res: Response, next: NextFunction): void {
  const apiKeyHeader = Array.isArray(req.headers['x-api-key'])
    ? req.headers['x-api-key'][0]
    : req.headers['x-api-key'];

  if (!process.env.MCP_API_KEY || apiKeyHeader !== process.env.MCP_API_KEY) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
}
