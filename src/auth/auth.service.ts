import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async login(loginBody: LoginDto): Promise<any> {
    // const user = await this.usersService.findOne(username);
    if (!loginBody.email || !loginBody.password) {
      throw new BadRequestException('All fields are required');
    }

    const foundUser = await this.prismaService.user.findUnique({
      where: {
        email: loginBody.email,
      },
    });

    const isPasswordMatching = bcrypt.compare(
      foundUser.password,
      loginBody.password,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException();
    }

    // TODO: Generate a JWT and return it here
    // instead of the user object
    return {
      message: 'Login successful',
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
    return {
      message: 'User successfully registered!',
    };
  }
}
