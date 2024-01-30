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
import { returnGroupOrderDtoMock } from '../../order-product/__mocks__/returnGroupOrderDto.mock';

describe('OrderService', () => {
  let service: OrderService;
  let orderProductService: OrderProductService;
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
            findOne: jest.fn().mockResolvedValue(orderEntityMock),
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
            findAmountOfProductsByOrderId: jest
              .fn()
              .mockResolvedValue([returnGroupOrderDtoMock]),
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
    orderProductService = module.get<OrderProductService>(OrderProductService);
    orderRepository = module.get<Repository<OrderEntity>>(
      getRepositoryToken(OrderEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(orderProductService).toBeDefined();
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

  describe('findAllOrders', () => {
    it('should return a list of all orders with relations', async () => {
      const spy = jest.spyOn(orderRepository, 'find');
      const allOrders = await service.findAllOrders();

      expect(allOrders).toEqual([orderEntityMock]);
      expect(spy).toHaveBeenCalledWith({
        relations: {
          user: true,
        },
      });
    });

    it('should return a list of all orders if findAmountOfProductsByOrderId is empty', async () => {
      jest
        .spyOn(orderProductService, 'findAmountOfProductsByOrderId')
        .mockResolvedValue([]);

      const spy = jest.spyOn(orderRepository, 'find');
      const allOrders = await service.findAllOrders();

      expect(allOrders).toEqual([orderEntityMock]);
      expect(spy).toHaveBeenCalledWith({
        relations: {
          user: true,
        },
      });
    });

    it('should throw an error if any order has not found', async () => {
      jest
        .spyOn(orderRepository, 'find')
        .mockRejectedValue(new NotFoundException());

      const allOrders = service.findAllOrders();

      expect(allOrders).rejects.toThrow(NotFoundException);
    });

    it('should return an error if retrieve an empty array', async () => {
      jest.spyOn(orderRepository, 'find').mockResolvedValue([]);

      const allOrders = service.findAllOrders();

      expect(allOrders).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByOrderId', () => {
    it('should return an order when it will searched by the order id', async () => {
      const spy = jest.spyOn(orderRepository, 'findOne');
      const order = await service.findByOrderId(orderEntityMock.id);

      expect(order).toEqual(orderEntityMock);
      expect(spy).toHaveBeenCalledWith({
        where: {
          id: orderEntityMock.id,
        },
        relations: {
          address: {
            city: {
              state: true,
            },
          },
          orders_product: {
            product: true,
          },
          payment: {
            payment_status: true,
          },
          user: true,
        },
      });
    });

    it('should throw an erro if no order is found', async () => {
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(null);

      const order = service.findByOrderId(orderEntityMock.id);

      expect(order).rejects.toThrow(NotFoundException);
    });
  });
});
