import { Controller, Get, Param } from '@nestjs/common';
import { CorreiosService } from './correios.service';
import { ReturnCepDto } from './dtos/returnCep.dto';
import { ResponsePriceCorreios } from './dtos/responsePriceCorreios.dto';

@Controller('correios')
export class CorreiosController {
  constructor(private readonly correiosService: CorreiosService) {}

  @Get('/price')
  async getPriceDelivery(): Promise<ResponsePriceCorreios> {
    return this.correiosService.findPriceAndDeliveryPrice();
  }

  @Get('/:cep')
  async getAddressData(@Param('cep') cep: string): Promise<ReturnCepDto> {
    return this.correiosService.getCepInformation(cep);
  }
}
