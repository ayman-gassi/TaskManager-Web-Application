import express from 'express';
import { registerUser, loginUser, sendRecoveryEmail, updateUserImages, updateProfile, deleteAccount, exportUserData } from '../controllers/userController.js';
import { upload } from '../config/multerConfig.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', sendRecoveryEmail);

// Profile routes
router.put('/profile', authenticateToken, updateProfile);
router.delete('/profile', authenticateToken, deleteAccount);
router.get('/export-data', authenticateToken, exportUserData);

// Image upload routes - make sure path matches frontend
router.post('/upload-images', 
    authenticateToken,
    upload.fields([
        { name: 'profileImage', maxCount: 1 },
        { name: 'bannerImage', maxCount: 1 }
    ]),
    updateUserImages
);

export default router;
