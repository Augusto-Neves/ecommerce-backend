import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from '../payment.service';
import { Repository } from 'typeorm';
import { PaymentEntity } from '../entities/payment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { cartEntityMock } from '../../cart/__mocks__/cartEntity.mock';
import { productMock } from '../../product/__mock__/product.mock';
import { cartProductMock } from '../../cart-product/__mocks__/cartProduct.mock';
import {
  createOrderDtoWithCardMock,
  createOrderDtoWithError,
  createOrderDtoWithPix,
} from '../../order/__mocks__/createOrderDto.mock';
import { paymentCreditCardMock } from '../__mocks__/payment-credit-card.mock';
import { paymentPixMock } from '../__mocks__/payment-pix.mock';
import { BadRequestException } from '@nestjs/common';

describe('PaymentService', () => {
  let service: PaymentService;
  let paymentRepository: Repository<PaymentEntity>;
  const products = [productMock];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(PaymentEntity),
          useValue: {
            save: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    paymentRepository = module.get<Repository<PaymentEntity>>(
      getRepositoryToken(PaymentEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(paymentRepository).toBeDefined();
  });

  describe('generateFinalPrice', () => {
    it('should return 0 if cart_product does not exist or your length is equal to zero', () => {
      const finalPrice = service.generateFinalPrice(
        { ...cartEntityMock, cart_product: [] },
        products,
      );

      expect(finalPrice).toEqual(0);
    });

    it('should return 0 if has no product', () => {
      const finalPrice = service.generateFinalPrice(cartEntityMock, []);

      expect(finalPrice).toEqual(0);
    });

    it('should return finalPrice', () => {
      const finalPrice = service.generateFinalPrice(cartEntityMock, products);

      expect(finalPrice).toEqual(productMock.price * cartProductMock.amount);
    });
  });

  describe('createPayment', () => {
    it('should create a payment using credit card', async () => {
      jest
        .spyOn(paymentRepository, 'save')
        .mockResolvedValue(paymentCreditCardMock);

      const paymentWithCreditCard = await service.createPayment(
        createOrderDtoWithCardMock,
        products,
        cartEntityMock,
      );

      expect(paymentWithCreditCard).toEqual(paymentCreditCardMock);
    });

    it('should create a payment using pix', async () => {
      jest.spyOn(paymentRepository, 'save').mockResolvedValue(paymentPixMock);

      const paymentWithPix = await service.createPayment(
        createOrderDtoWithPix,
        products,
        cartEntityMock,
      );

      expect(paymentWithPix).toEqual(paymentPixMock);
    });

    it('should throw an error if payload is invalid', () => {
      const payment = service.createPayment(
        createOrderDtoWithError,
        products,
        cartEntityMock,
      );

      expect(payment).rejects.toThrow(BadRequestException);
    });
  });
});
