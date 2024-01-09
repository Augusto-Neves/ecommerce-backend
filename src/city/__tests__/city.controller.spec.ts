import { Test, TestingModule } from '@nestjs/testing';
import { cityMock } from '../__mocks__/city.mock';
import { CityController } from '../city.controller';
import { CityService } from '../city.service';

describe('CityController', () => {
  let controller: CityController;
  let service: CityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CityController],
      providers: [
        {
          provide: CityService,
          useValue: {
            getAllCitiesByStateId: jest.fn().mockResolvedValue([cityMock]),
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
    const cities = await controller.getAllCitiesByStateId(cityMock.state_id);

    expect(cities).toEqual([cityMock]);
  });
});
