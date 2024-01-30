import { Test, TestingModule } from '@nestjs/testing';
import { CorreiosController } from '../correios.controller';
import { CorreiosService } from '../correios.service';

describe('CorreiosController', () => {
  let controller: CorreiosController;
  let service: CorreiosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CorreiosController],
      providers: [{ provide: CorreiosService, useValue: {} }],
    }).compile();

    controller = module.get<CorreiosController>(CorreiosController);
    service = module.get<CorreiosService>(CorreiosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
