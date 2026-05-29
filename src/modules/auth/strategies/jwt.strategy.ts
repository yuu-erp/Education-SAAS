import { Injectable } from '@nestjs/common';

/**
 * TODO:
 * 1. Install @nestjs/passport and passport-jwt
 * 2. Extend this class with PassportStrategy(Strategy, 'jwt')
 * 3. Inject ConfigService to get JWT_SECRET
 * 4. Implement validate(payload) method to extract and verify AuthUser
 */
@Injectable()
export class JwtStrategy {
  // Placeholder for real Passport JWT Strategy
}
