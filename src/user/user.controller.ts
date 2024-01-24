import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserService } from './user.service';
import { ReturnUserDto } from './dtos/returnUser.dto';
import { UpdatePasswordDto } from './dtos/updatePassword.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from './enum/user-types.enum';
import { UpdateResult } from 'typeorm';
import { UserId } from '../decorators/user-id.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() user: CreateUserDto): Promise<ReturnUserDto> {
    const createdUser = await this.userService.createUser(user);

    return new ReturnUserDto(createdUser);
  }

  @Roles(UserType.Admin)
  @Get('all')
  async getAllUsers(): Promise<ReturnUserDto[]> {
    return (await this.userService.getAllUsers()).map(
      (user) => new ReturnUserDto(user),
    );
  }

  @Roles(UserType.Admin)
  @Get('/:userId')
  async getUserByUserId(
    @Param('userId') userId: number,
  ): Promise<ReturnUserDto> {
    const user = await this.userService.getUserByIdUsingRelations(userId);

    return new ReturnUserDto(user);
  }

  @Roles(UserType.User, UserType.Admin)
  @Patch()
  async updateUserPassword(
    @UserId() user_id: number,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<UpdateResult> {
    return this.userService.updateUserPassword(updatePasswordDto, user_id);
  }

  @Roles(UserType.User, UserType.Admin)
  @Get()
  async getUserInfo(@UserId() user_id: number): Promise<ReturnUserDto> {
    const user = await this.userService.getUserByIdUsingRelations(user_id);

    return new ReturnUserDto(user);
  }
}
