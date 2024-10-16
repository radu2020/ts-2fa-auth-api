import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import speakeasy from 'speakeasy';
import { sendSMS } from '../config/twilio';
import { users, findUserByEmail, updateUserDetails } from './userService';
import { generateToken } from '../utils/jwt';

const saltRounds = 10;

// Register user
export const register = async (req: Request, res: Response) => {
  const { name, email, mobile, password } = req.body;

  if (findUserByEmail(email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  users.set(email, { name, email, mobile, password: hashedPassword });
  
  return res.status(201).json({ message: 'User registered successfully' });
};

// Login user and send 2FA code
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);

  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Generate 2FA code
  const code = speakeasy.totp({
    secret: user.secret || user.mobile,
    encoding: 'base32',
  });

  // Send code via SMS
  await sendSMS(user.mobile, `Your 2FA code is ${code}`);

  const token = generateToken({ email });
  return res.status(200).json({ message: '2FA code sent via SMS', token });
};

// Verify 2FA code
export const verify2FA = (req: Request, res: Response) => {
  const { email, code } = req.body;
  const user = findUserByEmail(email);

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const isValidCode = speakeasy.totp.verify({
    secret: user.secret || user.mobile,
    encoding: 'base32',
    token: code,
  });

  if (!isValidCode) {
    return res.status(400).json({ message: 'Invalid 2FA code' });
  }

  const accessToken = generateToken({ email });
  return res.status(200).json({ message: 'Login successful', accessToken });
};

// Update user details (name, email)
export const updateProfile = (req: Request, res: Response) => {
  const { email, name, newEmail } = req.body;
  if (updateUserDetails(email, name, newEmail)) {
    return res.status(200).json({ message: 'User profile updated successfully' });
  }
  return res.status(400).json({ message: 'Failed to update profile' });
};

// Change password (with SMS verification)
export const changePassword = async (req: Request, res: Response) => {
  const { email, newPassword, smsCode } = req.body;
  const user = findUserByEmail(email);

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const isValidCode = speakeasy.totp.verify({
    secret: user.secret || user.mobile,
    encoding: 'base32',
    token: smsCode,
  });

  if (!isValidCode) {
    return res.status(400).json({ message: 'Invalid SMS code' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  user.password = hashedPassword;
  
  return res.status(200).json({ message: 'Password changed successfully' });
};
