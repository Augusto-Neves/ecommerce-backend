import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../user/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ReturnLoginDto } from './dto/returnLogin.dto';
import { ReturnUserDto } from '../user/dtos/returnUser.dto';
import { LoginPayloadDto } from './dto/loginPayload.dto';
import { validatePassword } from '../utils/validate-password';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<ReturnLoginDto> {
    const user: UserEntity | undefined = await this.userService
      .findUserByEmail(loginDto.email)
      .catch(() => undefined);

    let userPassword = '';

    if (user) {
      userPassword = user.password;
    }

    const matchPassword = await validatePassword(
      loginDto.password,
      userPassword,
    );

    if (!user || !matchPassword) {
      throw new NotFoundException('Email or password invalid');
    }

    return {
      access_token: this.jwtService.sign({ ...new LoginPayloadDto(user) }),
      user: new ReturnUserDto(user),
    };
  }
}
