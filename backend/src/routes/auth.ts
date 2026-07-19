import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { isMongoConnected } from '../config/db';
import { User } from '../models/User';
import { usersMockStore, UserMock } from '../config/mockStore';
import { protect, AuthenticatedRequest } from '../middlewares/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'style_era_jwt_secret_token_12345';

// Sign JWT helper
const generateToken = (id: string): string => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/register
// @desc    Register a new female user with profile prefs
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, ageGroup, stylePreferences } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ message: 'Please enter all required fields' });
    return;
  }

  const validAgeGroup = ['child', 'young', 'old'].includes(ageGroup) ? ageGroup : 'young';

  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    if (isMongoConnected) {
      // MONGODB MODE
      const userExists = await User.findOne({ $or: [{ email }, { username }] });
      if (userExists) {
        res.status(400).json({ message: 'User with this email or username already exists' });
        return;
      }

      const user = await User.create({
        username,
        email,
        password: passwordHash,
        ageGroup: validAgeGroup,
        stylePreferences: stylePreferences || [],
      });

      res.status(201).json({
        token: generateToken(user._id.toString()),
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          ageGroup: user.ageGroup,
          stylePreferences: user.stylePreferences,
        },
      });
    } else {
      // OFFLINE MOCK MODE
      const mockExists = usersMockStore.find(u => u.email === email || u.username === username);
      if (mockExists) {
        res.status(400).json({ message: 'Mock user with this email or username already exists' });
        return;
      }

      const newUser: UserMock = {
        _id: 'mock-user-' + Date.now(),
        username,
        email,
        passwordHash,
        ageGroup: validAgeGroup as 'child' | 'young' | 'old',
        stylePreferences: stylePreferences || [],
        createdAt: new Date(),
      };

      usersMockStore.push(newUser);

      res.status(201).json({
        token: generateToken(newUser._id),
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          ageGroup: newUser.ageGroup,
          stylePreferences: newUser.stylePreferences,
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Please provide email and password' });
    return;
  }

  try {
    if (isMongoConnected) {
      // MONGODB MODE
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: 'Invalid credentials' });
        return;
      }

      res.json({
        token: generateToken(user._id.toString()),
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          ageGroup: user.ageGroup,
          stylePreferences: user.stylePreferences,
        },
      });
    } else {
      // OFFLINE MOCK MODE
      const mockUser = usersMockStore.find(u => u.email === email);
      if (!mockUser) {
        res.status(400).json({ message: 'Invalid credentials (Mock Mode)' });
        return;
      }

      const isMatch = await bcrypt.compare(password, mockUser.passwordHash);
      if (!isMatch) {
        res.status(400).json({ message: 'Invalid credentials (Mock Mode)' });
        return;
      }

      res.json({
        token: generateToken(mockUser._id),
        user: {
          id: mockUser._id,
          username: mockUser.username,
          email: mockUser.email,
          ageGroup: mockUser.ageGroup,
          stylePreferences: mockUser.stylePreferences,
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get('/me', protect, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  res.json({ user: req.user });
});

export default router;
