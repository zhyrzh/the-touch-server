import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseBoolPipe,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';

export interface IGetAllQueryParams {
  position: string;
  isApproved: boolean;
  hasProfile: boolean;
}

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  async getProfile(@Request() req: Request) {
    return await this.userService.getProfile(req['user'].email);
  }

  @Get('/by-position/:position')
  async getAllByPosition(@Param('position') position: string) {
    return await this.userService.getAllByPosition(position);
  }

  @Post('/')
  async createProfile(@Body() body: any, @Request() req: Request) {
    return this.userService.createProfile(body, req['user'].email);
  }

  @Put('/accept-reject/:id')
  async acceptOrRejectUser(@Param('id') id: string) {
    return this.userService.acceptOrRejectUser(id);
  }

  @Get('all')
  async getAll(
    @Query('position', new DefaultValuePipe(''))
    position: string,
    @Query(
      'isApproved',
      new DefaultValuePipe(false),
      new ParseBoolPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    isApproved?: boolean,
    @Query(
      'hasProfile',
      new DefaultValuePipe(true),
      new ParseBoolPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    hasProfile?: boolean,
  ) {
    console.log(position, isApproved);
    return this.userService.getAll({
      position,
      isApproved,
      hasProfile,
    });
  }
}
