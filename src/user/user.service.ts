import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserEntity } from './entities/user.entity';
import { hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(user: CreateUserDto): Promise<UserEntity> {
    const saltsOfRounds = 12;
    const encryptedPassword = await hash(user.password, saltsOfRounds);

    return this.userRepository.save({
      ...user,
      type_user: 1,
      password: encryptedPassword,
    });
  }

  async getUserByIdUsingRelations(user_id: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: {
        id: user_id,
      },
      relations: ['addresses'],
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
}
