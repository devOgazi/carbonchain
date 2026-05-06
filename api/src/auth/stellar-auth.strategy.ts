import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  account: string;
  iat: number;
  exp: number;
}

/**
 * JWT strategy for wallet-based auth (SEP-10).
 * Validates the Bearer token issued after a successful SEP-10 challenge/response.
 * The token payload carries the authenticated Stellar account public key.
 */
@Injectable()
export class StellarAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET', 'changeme'),
    });
  }

  /** Called after signature verification — return value is attached to req.user */
  validate(payload: JwtPayload): { account: string } {
    return { account: payload.account };
  }
}
