import { userEntityMock } from '../../user/__mocks__/user.mock';
import { ReturnLoginDto } from '../dto/returnLogin.dto';
import { jwtMock } from './jwt.mock';
import { ReturnUserDto } from '../../user/dtos/returnUser.dto';

export const returnLoginDtoMock: ReturnLoginDto = {
  access_token: jwtMock,
  user: new ReturnUserDto(userEntityMock),
};
