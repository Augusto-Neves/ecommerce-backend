import { CreateAddressDto } from '../dto/createAddress.dto';
import { addressMock } from './address.mock';

export const createAddressMock: CreateAddressDto = {
  cep: addressMock.cep,
  city_id: addressMock.city_id,
  complement: addressMock.complement,
  numberAddress: addressMock.numberAddress,
};
