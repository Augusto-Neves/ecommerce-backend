import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderProductService } from '../order-product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderProductEntity } from '../entities/order-product.entity';

describe('OrderProductService', () => {
  let service: OrderProductService;
  let orderRepository: Repository<OrderProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderProductService,
        {
          provide: getRepositoryToken(OrderProductEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<OrderProductService>(OrderProductService);
    orderRepository = module.get<Repository<OrderProductEntity>>(
      getRepositoryToken(OrderProductEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(orderRepository).toBeDefined();
  });
});
