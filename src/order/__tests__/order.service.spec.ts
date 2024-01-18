import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../order.service';
import { Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaymentService } from '../../payment/payment.service';
import { CartService } from '../../cart/cart.service';
import { OrderProductService } from '../../order-product/order-product.service';
import { ProductService } from '../../product/product.service';
import { orderEntityMock } from '../__mocks__/orderEntity.mock';
import { returnInsertMock } from '../../__mocks__/returnInsert.mock';
import { createOrderDtoWithCardMock } from '../__mocks__/createOrderDto.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { paymentMock } from '../../payment/__mocks__/payment.mock';
import { orderProductEntityMock } from '../../order-product/__mocks__/orderProductEntity.mock';
import { cartEntityMock } from '../../cart/__mocks__/cartEntity.mock';
import { productMock } from '../../product/__mock__/product.mock';
import { returnUpdateMock } from '../../__mocks__/returnUpdate.mock';
import { NotFoundException } from '@nestjs/common';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: Repository<OrderEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(OrderEntity),
          useValue: {
            create: jest.fn().mockResolvedValue(orderEntityMock),
            insert: jest.fn().mockResolvedValue(returnInsertMock),
            find: jest.fn().mockResolvedValue([orderEntityMock]),
          },
        },
        {
          provide: PaymentService,
          useValue: {
            createPayment: jest.fn().mockResolvedValue(paymentMock),
          },
        },
        {
          provide: CartService,
          useValue: {
            findCartByUserId: jest.fn().mockResolvedValue(cartEntityMock),
            clearCart: jest.fn().mockResolvedValue(returnUpdateMock),
          },
        },
        {
          provide: OrderProductService,
          useValue: {
            createOrderProduct: jest
              .fn()
              .mockResolvedValue(orderProductEntityMock),
          },
        },
        {
          provide: ProductService,
          useValue: {
            getAllProducts: jest.fn().mockResolvedValue([productMock]),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get<Repository<OrderEntity>>(
      getRepositoryToken(OrderEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(orderRepository).toBeDefined();
  });

  describe('saveOrder', () => {
    it('should save a new order', async () => {
      const saveOrder = await service.saveOrder(
        createOrderDtoWithCardMock,
        userEntityMock.id,
        paymentMock,
      );

      expect(saveOrder).toEqual(orderEntityMock);
    });
  });

  describe('createOrderProductUsingCart', () => {
    it('should create a order product using an existent cart', async () => {
      const product = [productMock];

      const orderProduct = await service.createOrderProductUsingCart(
        cartEntityMock,
        orderEntityMock.id,
        product,
      );

      expect(orderProduct).toEqual([orderProductEntityMock]);
    });
  });

  describe('createOrder', () => {
    it('should create a new order ', async () => {
      const order = await service.createOrder(
        createOrderDtoWithCardMock,
        userEntityMock.id,
      );

      expect(order).toEqual(orderEntityMock);
    });
  });

  describe('findOrdersByUserId', () => {
    it('should return a order to user id', async () => {
      const order = await service.findOrdersByUserId(userEntityMock.id);

      expect(order).toEqual([orderEntityMock]);
    });

    it('should return an error if no one order was found', async () => {
      jest.spyOn(orderRepository, 'find').mockResolvedValue([]);

      const order = service.findOrdersByUserId(userEntityMock.id);

      expect(order).rejects.toThrow(NotFoundException);
    });
  });
});
