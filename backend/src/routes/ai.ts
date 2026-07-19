import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { isMongoConnected } from '../config/db';
import { User } from '../models/User';
import { usersMockStore } from '../config/mockStore';
import { AuthenticatedRequest } from '../middlewares/auth';
import { getStyleAdvice, getSmartRecommendations } from '../controllers/aiController';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'style_era_jwt_secret_token_12345';

// Optional Authentication Middleware
async function optionalProtect(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    if (isMongoConnected) {
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          ageGroup: user.ageGroup as 'child' | 'young' | 'old',
          stylePreferences: user.stylePreferences,
        };
      }
    } else {
      const mockUser = usersMockStore.find(u => u._id === decoded.id);
      if (mockUser) {
        req.user = {
          id: mockUser._id,
          username: mockUser.username,
          email: mockUser.email,
          ageGroup: mockUser.ageGroup,
          stylePreferences: mockUser.stylePreferences,
        };
      }
    }
  } catch (error) {
    // Ignore invalid tokens for optional endpoints, just treat as guest
    console.warn('Optional auth token verification failed, proceeding as guest');
  }

  next();
}

// Router assignments
router.post('/advisor', optionalProtect, getStyleAdvice);
router.get('/recommend', optionalProtect, getSmartRecommendations);

export default router;
