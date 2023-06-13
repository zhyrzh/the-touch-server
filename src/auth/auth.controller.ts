import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/login')
  login(@Body() loginBody: LoginDto) {
    return this.authService.login(loginBody);
  }

  // TODO: Requires email, name, password
  @Post('/register')
  register(@Body() registerBody: RegisterDto) {
    return this.authService.register(registerBody);
  }
}
