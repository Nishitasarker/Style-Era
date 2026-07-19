import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { isMongoConnected } from '../config/db';
import { User } from '../models/User';
import { usersMockStore } from '../config/mockStore';

const JWT_SECRET = process.env.JWT_SECRET || 'style_era_jwt_secret_token_12345';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    ageGroup: 'child' | 'young' | 'old';
    stylePreferences: string[];
  };
}

export async function protect(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, token missing' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    if (isMongoConnected) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        res.status(401).json({ message: 'Not authorized, user not found' });
        return;
      }
      req.user = {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        ageGroup: user.ageGroup as 'child' | 'young' | 'old',
        stylePreferences: user.stylePreferences,
      };
    } else {
      const mockUser = usersMockStore.find(u => u._id === decoded.id);
      if (!mockUser) {
        res.status(401).json({ message: 'Not authorized, mock user not found' });
        return;
      }
      req.user = {
        id: mockUser._id,
        username: mockUser.username,
        email: mockUser.email,
        ageGroup: mockUser.ageGroup,
        stylePreferences: mockUser.stylePreferences,
      };
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token validation failed' });
  }
}
