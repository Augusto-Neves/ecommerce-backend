import { cityMock } from '../../city/__mocks__/city.mock';
import { AddressEntity } from '../entities/address.entity';
import { userEntityMock } from '../../user/__mocks__/user.mock';

export const addressMock: AddressEntity = {
  cep: '5489868',
  city_id: cityMock.id,
  complement: 'apartment',
  created_at: new Date(),
  id: 5789,
  numberAddress: 687,
  updated_at: new Date(),
  user_id: userEntityMock.id,
};
