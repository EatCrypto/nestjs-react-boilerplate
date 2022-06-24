import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthResponseDto } from 'src/auth/dto/auth-response.dto';
import { AuthApi } from 'src/auth/auth.decorator';
import { Roles } from 'src/shared/role.decorator';
import { Role } from './enum/role.enum';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() input: LoginUserDto): Promise<AuthResponseDto> {
    return await this.authService.login(input.username, input.password);
  }

  @AuthApi()
  @Roles(Role.Admin)
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }
}
