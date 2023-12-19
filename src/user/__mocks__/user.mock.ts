import { UserEntity } from '../entities/user.entity';
import { UserType } from '../enum/user-types.enum';

export const userEntityMock: UserEntity = {
  cpf: '38597789719',
  created_at: new Date(),
  email: 'user@example.com',
  id: 1987,
  name: 'John',
  password: '$2b$12$qiraArz3R2w6DWuymtfOI.hC03ZEXPfin5TkrcVu3s5U/9U9iiehm',
  phone: '87988754654',
  type_user: UserType.User,
  updated_at: new Date(),
  addresses: [],
};
