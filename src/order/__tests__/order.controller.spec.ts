import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../order.controller';
import { OrderService } from '../order.service';
import { createOrderDtoWithPix } from '../__mocks__/createOrderDto.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { orderEntityMock } from '../__mocks__/orderEntity.mock';
import { ReturnOrderDto } from '../dtos/returnOrder.dto';

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
            findByOrderId: jest.fn().mockResolvedValue(orderEntityMock),
            findOrdersByUserId: jest.fn().mockResolvedValue([orderEntityMock]),
            findAllOrders: jest.fn().mockResolvedValue([orderEntityMock]),
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

  it('should return an array with all orders', async () => {
    const spy = jest.spyOn(service, 'findAllOrders');
    const allOrder = await controller.findAllOrders();

    expect(allOrder).toEqual([new ReturnOrderDto(orderEntityMock)]);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should find an order by id and return it', async () => {
    const spy = jest.spyOn(service, 'findByOrderId');
    const order = await controller.findByOrderId(orderEntityMock.id);

    expect(order).toEqual(new ReturnOrderDto(orderEntityMock));
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
