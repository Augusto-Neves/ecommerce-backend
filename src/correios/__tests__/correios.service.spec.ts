import { Test, TestingModule } from '@nestjs/testing';
import { CorreiosService } from '../correios.service';
import { CityService } from '../../city/city.service';
import { HttpService } from '@nestjs/axios';
import { cityMock } from '../../city/__mocks__/city.mock';
import { returnCepDtoMock } from '../__mocks__/returnCepDto.mock';
import { returnCepExternalDtoMock } from '../__mocks__/returnCepExternalDto.mock';
import { NotFoundException } from '@nestjs/common';
import { Client } from 'nestjs-soap';

describe('CorreiosService', () => {
  let service: CorreiosService;
  let httpService: HttpService;
  let cityService: CityService;
  let clientSoap: Client;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CorreiosService,
        {
          provide: CityService,
          useValue: {
            findCityByName: jest.fn().mockResolvedValue(cityMock),
          },
        },
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              get: jest.fn().mockResolvedValue({
                data: returnCepExternalDtoMock,
              }),
            },
          },
        },
        {
          provide: Client,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CorreiosService>(CorreiosService);
    cityService = module.get<CityService>(CityService);
    httpService = module.get<HttpService>(HttpService);
    clientSoap = module.get<Client>(Client);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cityService).toBeDefined();
    expect(httpService).toBeDefined();
    expect(clientSoap).toBeDefined();
  });

  describe('getCepInformation', () => {
    beforeEach(() => {
      service.BASE_URL = 'https://myurl.com/{CEP}.json';
    });

    it('should return information about cep', async () => {
      const cepInfo = await service.getCepInformation(returnCepDtoMock.cep);

      expect(cepInfo).toEqual(returnCepDtoMock);
    });

    it('should return an error if cep is not found', async () => {
      const cepInfo = await service.getCepInformation(returnCepDtoMock.cep);

      expect(cepInfo).rejects.toThrow(NotFoundException);
    });
  });
});
