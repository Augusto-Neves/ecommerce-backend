import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { AuthController } from '../auth.controller';
import { loginPayloadMock } from '../__mocks__/loginPayload.mock';
import { returnLoginDtoMock } from '../__mocks__/returnLoginDto.mock';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue(returnLoginDtoMock),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should return an login stance', async () => {
    const loggedUser = await controller.login(loginPayloadMock);

    expect(loggedUser).toEqual(returnLoginDtoMock);
  });
});
