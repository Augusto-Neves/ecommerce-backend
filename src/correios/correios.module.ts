import { Module } from '@nestjs/common';
import { CorreiosController } from './correios.controller';
import { CorreiosService } from './correios.service';
import { HttpModule } from '@nestjs/axios';
import { CityModule } from 'src/city/city.module';
import { SoapModule } from 'nestjs-soap';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    SoapModule.register({
      clientName: 'SOAP_CORREIOS',
      uri: 'https://apps.correios.com.br/SigepMasterJPA/AtendeClienteService/AtendeCliente?wsdl',
    }),
    CityModule,
  ],
  controllers: [CorreiosController],
  providers: [CorreiosService],
})
export class CorreiosModule {}
