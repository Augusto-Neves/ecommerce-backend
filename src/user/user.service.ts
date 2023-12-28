import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UserType } from './enum/user-types.enum';
import { UpdatePasswordDto } from './dtos/updatePassword.dto';
import { createPasswordHashed } from '../utils/create-password-hashed';
import { validatePassword } from '../utils/validate-password';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.findUserByEmail(createUserDto.email).catch(
      () => undefined,
    );

    if (user) {
      throw new HttpException('This email already registered', 403);
    }

    const encryptedPassword = await createPasswordHashed(
      createUserDto.password,
    );

    const newUser = this.userRepository.create({
      ...createUserDto,
      type_user: UserType.User,
      password: encryptedPassword,
    });

    await this.userRepository.insert(newUser);

    return newUser;
  }

  async getUserByIdUsingRelations(user_id: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: {
        id: user_id,
      },
      relations: {
        addresses: {
          city: {
            state: true,
          },
        },
      },
    });
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findUserById(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUserPassword(
    updatePasswordDto: UpdatePasswordDto,
    user_id: number,
  ): Promise<UpdateResult> {
    const user = await this.findUserById(user_id);

    const passwordHashed = await createPasswordHashed(
      updatePasswordDto.newPassword,
    );

    const isPasswordMatch = await validatePassword(
      updatePasswordDto.lastPassword,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException('Last password is invalid');
    }

    return this.userRepository.update(
      { password: user.password },
      { password: passwordHashed },
    );
  }
}
