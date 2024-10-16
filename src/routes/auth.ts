import { Router } from 'express';
import { register, login, verify2FA, updateProfile, changePassword } from '../services/authService';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-2fa', verify2FA);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

export default router;
