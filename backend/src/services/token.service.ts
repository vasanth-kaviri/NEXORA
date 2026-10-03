import jwt, { SignOptions } from 'jsonwebtoken';
import { AppError } from '../utils/appResponse';

interface TokenPayload {
  id: string;
  role: string;
  isVerified: boolean;
}

// --- Generate Access Token (short-lived: 15m) ---------------------------------
export const generateAccessToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'your-default-secret';

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as SignOptions['expiresIn'],
    algorithm: 'HS256',
  };
  return jwt.sign(payload, secret, options);
};

// --- Generate Refresh Token (long-lived: 7d) ----------------------------------
export const generateRefreshToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new AppError('JWT_REFRESH_SECRET not configured.', 500);

  const options: SignOptions = {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
    algorithm: 'HS256',
  };
  return jwt.sign(payload, secret, options);
};

// --- Verify Refresh Token -----------------------------------------------------
export const verifyRefreshToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new AppError('JWT_REFRESH_SECRET not configured.', 500);

  try {
    return jwt.verify(token, secret) as TokenPayload;
  } catch {
    throw new AppError('Invalid or expired refresh token.', 401);
  }
};
