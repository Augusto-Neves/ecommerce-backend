import { addressMock } from '../../address/__mocks__/address.mock';
import { ReturnCepDto } from '../dtos/returnCep.dto';
import { returnCepExternalDtoMock } from './returnCepExternalDto.mock';

export const returnCepDtoMock: ReturnCepDto = {
  cep: addressMock.cep,
  city: addressMock.city.name,
  complement: addressMock.complement,
  ddd: returnCepExternalDtoMock.ddd,
  neighborhood: returnCepExternalDtoMock.bairro,
  street: returnCepExternalDtoMock.logradouro,
  uf: addressMock.city.state.uf,
  city_id: addressMock.city_id,
  state_id: addressMock.city.state_id,
};
