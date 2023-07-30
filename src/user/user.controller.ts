import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  async getProfile(@Request() req: Request) {
    return await this.userService.getProfile(req['user'].email);
  }

  @Post('/')
  async createProfile(@Body() body: any, @Request() req: Request) {
    return this.userService.createProfile(body, req['user'].email);
  }
}
