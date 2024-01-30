import { ReturnCepExternalDto } from './returnCepExternal.dto';

export class ReturnCepDto {
  cep: string;
  street: string;
  complement: string;
  neighborhood: string;
  city: string;
  uf: string;
  ddd: string;
  city_id?: number;
  state_id?: number;

  constructor(
    cepInfo: ReturnCepExternalDto,
    city_id?: number,
    state_id?: number,
  ) {
    this.cep = cepInfo.cep;
    this.street = cepInfo.logradouro;
    this.complement = cepInfo.complemento;
    this.neighborhood = cepInfo.bairro;
    this.city = cepInfo.localidade;
    this.uf = cepInfo.uf;
    this.ddd = cepInfo.ddd;
    this.city_id = city_id ? city_id : undefined;
    this.state_id = state_id ? state_id : undefined;
  }
}
