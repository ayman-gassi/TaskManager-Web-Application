import express from 'express';
import { registerUser, loginUser , authentificatedUser, sendRecoveryEmail } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/auth', authentificatedUser);
router.post('/forgotPassword', sendRecoveryEmail);

export default router;
