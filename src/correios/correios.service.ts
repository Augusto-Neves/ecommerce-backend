import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { ReturnCepExternalDto } from './dtos/returnCepExternal.dto';
import { CityService } from '../city/city.service';
import { ReturnCepDto } from './dtos/returnCep.dto';
import { CityEntity } from '../city/entities/city.entity';
import { Client } from 'nestjs-soap';
import { ResponsePriceCorreios } from './dtos/responsePriceCorreios.dto';

@Injectable()
export class CorreiosService {
  constructor(
    @Inject('SOAP_CORREIOS')
    private readonly soapClient: Client,
    private readonly httpService: HttpService,
    private readonly cityService: CityService,
  ) {}

  BASE_URL = process.env.CORREIOS_URL;

  async getCepInformation(cep: string): Promise<ReturnCepDto> {
    const cepData: ReturnCepExternalDto = await this.httpService.axiosRef
      .get<ReturnCepExternalDto>(this.BASE_URL.replace('{CEP}', cep))
      .then((res) => {
        if (res.data.erro) {
          throw new NotFoundException(`Cep ${cep} not found`);
        }
        return res.data;
      })
      .catch((error: AxiosError) => {
        throw new BadRequestException(error.message);
      });

    const city: CityEntity | undefined = await this.cityService
      .findCityByName(cepData.localidade, cepData.uf)
      .catch(() => undefined);

    return new ReturnCepDto(cepData, city?.id, city?.state_id);
  }

  async findPriceAndDeliveryPrice(): Promise<ResponsePriceCorreios> {
    return new Promise((resolve) => {
      this.soapClient.calculaTarifaServico(
        {
          usuario: '',
          senha: '',
          codServico: '40010',
          cepOrigem: '22270010',
          cepDestino: '89010000',
          peso: 2,
          codFormato: 1,
          comprimento: 30,
          altura: 30,
          largura: 30,
          diametro: 30,
          codMaoPropria: 'N',
          valorDeclarado: 0,
          codAvisoRecebimento: 'N',
        },
        (_: any, res: ResponsePriceCorreios) => {
          if (res) {
            resolve(res);
          } else {
            throw new BadRequestException('Error in SOAP request');
          }
        },
      );
    });
  }
}
