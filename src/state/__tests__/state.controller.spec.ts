import { Test, TestingModule } from '@nestjs/testing';
import { StateController } from '../state.controller';
import { StateService } from '../state.service';
import { stateMock } from '../__mocks__/state.mock';

describe('StateController', () => {
  let controller: StateController;
  let service: StateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StateController],
      providers: [
        {
          provide: StateService,
          useValue: {
            getAllStates: jest.fn().mockResolvedValue([stateMock]),
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
    const states = await controller.getAllStates();

    expect(states).toEqual([stateMock]);
  });
});
