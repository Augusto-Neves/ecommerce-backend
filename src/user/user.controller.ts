import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserService } from './user.service';
import { ReturnUserDto } from './dtos/returnUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(ValidationPipe)
  @Post()
  async createUser(@Body() user: CreateUserDto): Promise<ReturnUserDto> {
    const createdUser = await this.userService.createUser(user);

    return new ReturnUserDto(createdUser);
  }

  @Get()
  async getAllUsers(): Promise<ReturnUserDto[]> {
    return (await this.userService.getAllUsers()).map(
      (user) => new ReturnUserDto(user),
    );
  }

  @Get('/:userId')
  async getUserByUserId(
    @Param('userId') userId: number,
  ): Promise<ReturnUserDto> {
    const user = await this.userService.getUserByIdUsingRelations(userId);

    return new ReturnUserDto(user);
  }
}
