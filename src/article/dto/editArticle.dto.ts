import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { UserEditDTO } from './userEdit.dto';

export class EditArticleDTO {
  @IsString()
  @IsOptional()
  category: string;

  @IsString()
  @IsOptional()
  headline: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsObject()
  @ValidateNested({ always: true, each: true })
  @Type(() => UserEditDTO)
  @IsOptional()
  author: UserEditDTO;

  @IsObject()
  @ValidateNested({ always: true, each: true })
  @Type(() => UserEditDTO)
  @IsOptional()
  graphicsArtist: UserEditDTO;

  @IsObject()
  @ValidateNested({ always: true, each: true })
  @Type(() => UserEditDTO)
  @IsOptional()
  photoJournalist: UserEditDTO;

  @IsArray()
  @IsOptional()
  featuredImages: string[];

  @IsString()
  @IsOptional()
  createdAt: string;
}
