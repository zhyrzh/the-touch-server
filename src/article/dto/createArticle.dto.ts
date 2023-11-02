import { IsNotEmpty, IsString } from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { UserDTO } from './user.dto';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  headline: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @ValidateNested({
    always: true,
    each: true,
  })
  @ArrayMinSize(1, {
    message: 'Author should not be empty',
  })
  @Type(() => UserDTO)
  author: UserDTO[];

  @IsArray()
  @Type(() => UserDTO)
  @IsNotEmpty()
  graphicsArtist: UserDTO[];

  @IsArray()
  @Type(() => UserDTO)
  @IsNotEmpty()
  photoJournalist: UserDTO[];

  @IsArray()
  featuredImages: string[];

  @IsString()
  createdAt: string;
}
