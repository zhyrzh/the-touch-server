import { IsEmail, IsString } from '@nestjs/class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
