import { userEntityMock } from '../../user/__mocks__/user.mock';
import { LoginDto } from '../dto/login.dto';

export const loginPayloadMock: LoginDto = {
  email: userEntityMock.email,
  password: 'wqeyguia1689qqhbgt1u768687h',
};
