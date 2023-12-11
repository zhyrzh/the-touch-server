import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { UserDTO } from './user.dto';
import { Optional } from '@nestjs/common';
import { ArrayMinSize } from '@nestjs/class-validator';

export class UserEditDTO {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({
    always: true,
    each: true,
  })
  @Type(() => UserDTO)
  @Optional()
  disconnect: UserDTO[];

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({
    always: true,
    each: true,
  })
  @Optional()
  @Type(() => UserDTO)
  connect: UserDTO[];
}
