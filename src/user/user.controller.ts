import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';

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
}
