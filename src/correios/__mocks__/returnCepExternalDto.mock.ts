import { addressMock } from '../../address/__mocks__/address.mock';
import { ReturnCepExternalDto } from '../dtos/returnCepExternal.dto';

export const returnCepExternalDtoMock: ReturnCepExternalDto = {
  bairro: 'neighborhood mock',
  cep: addressMock.cep,
  complemento: addressMock.complement,
  ddd: '58',
  localidade: addressMock.city.name,
  logradouro: 'street mock',
  uf: addressMock.city.state.uf,
};
