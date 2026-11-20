import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

const MAX_FAILED_ATTEMPTS = 5;

@Injectable()
export class AuthService {
  // Logged-out tokens (simple in-memory blocklist; resets when the server restarts)
  private readonly blockedTokens = new Set<string>();

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user) throw new UnauthorizedException('Invalid email or password.');

    if (!user.isActive || user.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      throw new ForbiddenException('Account is disabled or locked. Contact the Admin.');
    }

    const passwordOk = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordOk) {
      await this.usersService.updateFailedAttempts(user.userId, user.failedAttempts + 1);
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (user.failedAttempts > 0) await this.usersService.updateFailedAttempts(user.userId, 0);

    // Payload has NO password or sensitive data (JWT is only Base64-encoded)
    const payload = {
      sub: user.userId,
      name: user.fullName,
      email: user.email,
      role: user.role,
    };
    return {
      success: true,
      accessToken: await this.jwtService.signAsync(payload),
      tokenType: 'Bearer',
      expiresIn: 3600,
    };
  }

  async me(userId: number) {
    return this.usersService.findById(userId);
  }

  logout(token: string) {
    this.blockedTokens.add(token);
  }

  isBlocked(token: string) {
    return this.blockedTokens.has(token);
  }
}
