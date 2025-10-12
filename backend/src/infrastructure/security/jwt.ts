import jwt from 'jsonwebtoken';
import { config } from '../../config/environment';
import { UnauthorizedError } from '../../shared/errors/AppError';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export class JWTService {
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwt.secret as jwt.Secret, {
      expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);
  }

  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwt.refreshSecret as jwt.Secret, {
      expiresIn: config.jwt.refreshExpiresIn,
    } as jwt.SignOptions);
  }

  static verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, config.jwt.secret) as TokenPayload;
    } catch (error) {
      throw new UnauthorizedError('Token inválido o expirado');
    }
  }

  static verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
    } catch (error) {
      throw new UnauthorizedError('Refresh token inválido o expirado');
    }
  }

  static generateTokenPair(payload: TokenPayload) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }
}
