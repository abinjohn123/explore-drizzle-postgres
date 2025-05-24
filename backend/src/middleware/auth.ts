import { Request, Response, NextFunction } from 'express';

import { User } from '@supabase/supabase-js';
import { supabaseClient } from '../lib/supabase';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      userId?: string;
    }
  }
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];
    const {
      data: { user },
      error,
    } = await supabaseClient.auth.getUser(token);

    if (error || !user) {
      console.error('Auth error:', error);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Add user info to request
    req.user = user;
    req.userId = user.id; // UUID that matches users.authId

    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const withAuth = (
  handler: (
    req: Request & { user: User; userId: string },
    res: Response,
  ) => Promise<void | Response>,
) => {
  return async (req: Request, res: Response) => {
    await authMiddleware(req, res, () => {
      handler(req as Request & { user: User; userId: string }, res);
    });
  };
};
