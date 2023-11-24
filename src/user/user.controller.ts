import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() user: CreateUserDto): Promise<UserEntity> {
    return this.userService.createUser(user);
  }

  @Get()
  async getAllUsers(): Promise<UserEntity[]> {
    return this.userService.getAllUsers();
  }
}
