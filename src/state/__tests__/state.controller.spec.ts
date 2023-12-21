import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StateController } from '../state.controller';
import { StateService } from '../state.service';
import { stateMock } from '../__mocks__/state.mock';
import { StateEntity } from '../entities/state.entity';

describe('StateController', () => {
  let controller: StateController;
  let service: StateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StateController],
      providers: [
        StateService,
        {
          provide: getRepositoryToken(StateEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([stateMock]),
            findOne: jest.fn().mockResolvedValue(stateMock),
          },
        },
      ],
    }).compile();

    controller = module.get<StateController>(StateController);
    service = module.get<StateService>(StateService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should return all states', async () => {
    jest.spyOn(service, 'getAllStates').mockResolvedValue([stateMock]);

    const states = await controller.getAllStates();

    expect(states).toEqual([stateMock]);
  });
});
