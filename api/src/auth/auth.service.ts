import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<AuthResponseDto> {
    const user = await this.usersService.findOneByUsername(username);

    if (user) {
      if (password === user.password) {
        const { password, ...result } = user;
        return {
          accessToken: this.jwtService.sign(result),
        };
      }
    }

    throw new Error('User not found!');
  }
}
