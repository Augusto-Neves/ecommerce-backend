import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderProductService } from '../order-product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderProductEntity } from '../entities/order-product.entity';
import { orderProductEntityMock } from '../__mocks__/orderProductEntity.mock';
import { returnInsertMock } from '../../__mocks__/returnInsert.mock';
import { productMock } from '../../product/__mock__/product.mock';
import { orderEntityMock } from '../../order/__mocks__/orderEntity.mock';

describe('OrderProductService', () => {
  let service: OrderProductService;
  let orderRepository: Repository<OrderProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderProductService,
        {
          provide: getRepositoryToken(OrderProductEntity),
          useValue: {
            create: jest.fn().mockResolvedValue(orderProductEntityMock),
            insert: jest.fn().mockResolvedValue(returnInsertMock),
          },
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

  describe('createOrderProduct', () => {
    it('should create a new order product', async () => {
      const orderProduct = await service.createOrderProduct(
        productMock.id,
        orderEntityMock.id,
        productMock.price,
        1,
      );

      expect(orderProduct).toEqual(orderProductEntityMock);
    });
  });
});
