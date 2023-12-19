import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { cityMock } from '../__mocks__/city.mock';
import { CityController } from '../city.controller';
import { CityEntity } from '../entities/city.entity';
import { CityService } from '../city.service';
import { CacheService } from '../../cache/cache.service';

describe('CityController', () => {
  let controller: CityController;
  let service: CityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CityController],
      providers: [
        CityService,
        {
          provide: CacheService,
          useValue: {
            getCacheData: jest.fn().mockResolvedValue([cityMock]),
          },
        },
        {
          provide: getRepositoryToken(CityEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([cityMock]),
            findOne: jest.fn().mockResolvedValue(cityMock),
          },
        },
      ],
    }).compile();

    controller = module.get<CityController>(CityController);
    service = module.get<CityService>(CityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should return all cities', async () => {
    jest.spyOn(service, 'getAllCitiesByStateId').mockResolvedValue([cityMock]);

    const cities = await controller.getAllCitiesByStateId(cityMock.state_id);

    expect(cities).toEqual([cityMock]);
  });
});
