import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async login(username: string, password: string): Promise<AuthResponseDto> {
    const user = await this.usersRepository.findOne({
      where: {
        username,
      },
      select: ['id', 'username', 'role', 'password'],
    });

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
