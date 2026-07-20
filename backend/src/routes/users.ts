import { Router } from 'express';
import { User } from '../models/User';
import { protect } from '../middlewares/auth';

const router = Router();

router.put('/profile', protect, async (req: any, res: any) => {
  try {
    const { username, avatarUrl } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id || req.user._id,
      { username, avatarUrl },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (err: any) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

export default router;