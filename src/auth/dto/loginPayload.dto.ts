import { UserEntity } from 'src/user/entities/user.entity';

export class LoginPayloadDto {
  id: number;
  type_user: number;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.type_user = user.type_user;
  }
}
