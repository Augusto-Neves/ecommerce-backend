import { ReturnUserDto } from '../dtos/returnUser.dto';
import { userEntityMock } from './user.mock';

export const returnUserDtoMock: ReturnUserDto = {
  id: userEntityMock.id,
  name: userEntityMock.name,
  email: userEntityMock.email,
  phone: userEntityMock.phone,
  cpf: '3********19',
  addresses: [],
};
