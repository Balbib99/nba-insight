import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config/auth.js';
import type { JwtPayload } from '../types/auth.js';

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload;
    }
  }
}

function isJwtPayload(value: unknown): value is JwtPayload {
  return (
    typeof value === 'object' &&
    value !== null &&
    'userId' in value &&
    'email' in value &&
    typeof (value as { userId: unknown }).userId === 'number' &&
    typeof (value as { email: unknown }).email === 'string'
  );
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authorizationHeader = req.header('Authorization');

  if (!authorizationHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authorizationHeader.slice('Bearer '.length).trim();

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);

    if (!isJwtPayload(decodedToken)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.auth = decodedToken;

    return next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
