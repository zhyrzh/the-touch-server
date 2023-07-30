import { IsString } from '@nestjs/class-validator';

export class UserDTO {
  @IsString()
  email: string;

  @IsString()
  name: string;
}
