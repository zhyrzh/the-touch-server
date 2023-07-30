import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginBody: LoginDto): Promise<any> {
    // const user = await this.usersService.findOne(username);

    if (!loginBody.email || !loginBody.password) {
      throw new BadRequestException('All fields are required');
    }

    const foundUser = await this.prismaService.user.findUnique({
      where: {
        email: loginBody.email,
      },
      include: {
        profile: true,
      },
    });

    if (!foundUser) {
      throw new UnauthorizedException('Invalid credentials', 'check error');
    }

    const isPasswordMatching = await bcrypt.compare(
      loginBody.password,
      foundUser.password,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials', 'check error');
    }

    const payload = {
      email: foundUser.email,
      sub: foundUser.email,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      payload: {
        profile: foundUser.profile,
        access_token,
      },
    };
  }

  async register(registerBody: RegisterDto) {
    if (!registerBody.email || !registerBody.password) {
      throw new BadRequestException('All fields are required');
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        email: registerBody.email,
      },
    });

    if (user) {
      throw new BadRequestException('User already exist!');
    }

    const hashedPassword = await bcrypt.hash(registerBody.password, 10);
    await this.prismaService.user.create({
      data: {
        email: registerBody.email,
        password: hashedPassword,
      },
    });

    const payload = {
      email: registerBody.email,
      sub: registerBody.email,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      message: 'User successfully registered!',
      payload: {
        access_token,
      },
    };
  }

  async verify() {
    return 'verified?';
  }
}
