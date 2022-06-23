import { IsNotEmpty, IsString } from 'class-validator';

export class AuthResponseDto {
  @IsNotEmpty()
  @IsString()
  accessToken: string;
}
