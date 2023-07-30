import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('/')
  verify() {
    return '';
  }

  @Public()
  @Post('/login')
  login(@Body() loginBody: LoginDto) {
    return this.authService.login(loginBody);
  }

  @Public()
  @Post('/register')
  register(@Body() registerBody: RegisterDto) {
    return this.authService.register(registerBody);
  }
}
