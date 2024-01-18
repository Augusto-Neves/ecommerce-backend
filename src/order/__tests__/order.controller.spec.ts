import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../order.controller';
import { OrderService } from '../order.service';
import { createOrderDtoWithPix } from '../__mocks__/createOrderDto.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { orderEntityMock } from '../__mocks__/orderEntity.mock';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            createOrder: jest.fn().mockResolvedValue(orderEntityMock),
            findOrdersByUserId: jest.fn().mockResolvedValue([orderEntityMock]),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should create a new order', async () => {
    const order = await controller.createOrder(
      createOrderDtoWithPix,
      userEntityMock.id,
    );

    expect(order).toEqual(orderEntityMock);
  });

  it('should return a list of order for a user id', async () => {
    const order = await controller.findOrdersByUserId(userEntityMock.id);

    expect(order).toEqual([orderEntityMock]);
  });
});
