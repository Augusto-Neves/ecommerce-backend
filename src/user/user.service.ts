import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/createUser.dto';
import { User } from './interface/user.interface';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  private users: User[] = [];

  async createUser(user: CreateUserDto): Promise<User> {
    const saltsOfRounds = 12;
    const encryptedPassword = await hash(user.password, saltsOfRounds);

    const newUser: User = {
      ...user,
      id: this.users.length + 1,
      password: encryptedPassword,
    };

    this.users.push(newUser);

    return newUser;
  }

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }
}
