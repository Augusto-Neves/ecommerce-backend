import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CartProductService } from '../cart-product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartProductEntity } from '../entities/cart-product.entity';
import { ProductService } from '../../product/product.service';
import { cartProductMock } from '../__mocks__/cartProduct.mock';
import { insertCartDtoMock } from '../../cart/__mocks__/insertCartDto.mock';
import { productMock } from '../../product/__mock__/product.mock';
import { cartEntityMock } from '../../cart/__mocks__/cartEntity.mock';
import { returnUpdateMock } from '../../__mocks__/returnUpdate.mock';
import { returnDeleteMock } from '../../__mocks__/returnDelete.mock';
import { updateCartDtoMock } from '../../cart/__mocks__/updateCartDto.mock';

describe('CartProductService', () => {
  let service: CartProductService;
  let cartProductRepository: Repository<CartProductEntity>;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartProductService,
        {
          provide: getRepositoryToken(CartProductEntity),
          useValue: {
            create: jest.fn().mockResolvedValue(cartProductMock),
            delete: jest.fn().mockResolvedValue(returnDeleteMock),
            insert: jest.fn().mockResolvedValue({}),
            findOne: jest.fn().mockResolvedValue(cartProductMock),
            update: jest.fn().mockResolvedValue(returnUpdateMock),
          },
        },
        {
          provide: ProductService,
          useValue: {
            findProductById: jest.fn().mockReturnValue(productMock),
          },
        },
      ],
    }).compile();

    service = module.get<CartProductService>(CartProductService);
    productService = module.get<ProductService>(ProductService);
    cartProductRepository = module.get<Repository<CartProductEntity>>(
      getRepositoryToken(CartProductEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cartProductRepository).toBeDefined();
    expect(productService).toBeDefined();
  });

  describe('verifyProductInCart', () => {
    it('should throw an error if the product is not found', () => {
      jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);

      const cartProduct = service.verifyProductInCart(
        cartProductMock.product_id,
        cartProductMock.cart_id,
      );

      expect(cartProduct).rejects.toThrow(NotFoundException);
    });

    it('should return an cartProduct object', async () => {
      const cartProduct = await service.verifyProductInCart(
        cartProductMock.product_id,
        cartProductMock.cart_id,
      );

      expect(cartProduct).toEqual(cartProductMock);
    });
  });

  describe('createProductInCart', () => {
    it('should create product in cart', async () => {
      const newProductInCart = await service.createProductInCart(
        insertCartDtoMock,
        cartProductMock.cart_id,
      );

      expect(newProductInCart).toEqual(cartProductMock);
    });
  });

  describe('insertProductInCart', () => {
    it('should return an error if product does not exist', async () => {
      jest
        .spyOn(productService, 'findProductById')
        .mockRejectedValue(new NotFoundException());

      const newProductInCart = service.insertProductInCart(
        insertCartDtoMock,
        cartEntityMock,
      );

      expect(newProductInCart).rejects.toThrow(NotFoundException);
    });

    it('should create product in cart if product does not exist in cart', async () => {
      jest.spyOn(service, 'verifyProductInCart').mockRejectedValue(undefined);

      const newProductInCart = await service.insertProductInCart(
        insertCartDtoMock,
        cartEntityMock,
      );
      expect(newProductInCart).toEqual(cartProductMock);
    });

    it('should insert a product in cart', async () => {
      const newProductInCart = await service.insertProductInCart(
        insertCartDtoMock,
        cartEntityMock,
      );
      expect(newProductInCart).toEqual(cartProductMock);
    });
  });

  describe('deleteProductFromCart', () => {
    it('should delete a product from cart', async () => {
      const deleteProductFromCart = await service.deleteProductFromCart(
        insertCartDtoMock.product_id,
        cartProductMock.cart_id,
      );

      expect(deleteProductFromCart).toEqual(returnDeleteMock);
    });
  });

  describe('updateProductInCart', () => {
    it('should return an error if the product is not in cart', async () => {
      jest
        .spyOn(productService, 'findProductById')
        .mockRejectedValue(new Error());

      const updateCart = service.updateProductCart(
        updateCartDtoMock,
        cartEntityMock,
      );

      expect(updateCart).rejects.toThrow();
    });

    it('should return an error if trying update an product that does not exist in cart', async () => {
      jest.spyOn(service, 'verifyProductInCart').mockRejectedValue(new Error());

      const updateCart = service.updateProductCart(
        updateCartDtoMock,
        cartEntityMock,
      );

      expect(updateCart).rejects.toThrow();
    });

    it('should update a product in cart', async () => {
      const updateCart = await service.updateProductCart(
        updateCartDtoMock,
        cartEntityMock,
      );

      expect(updateCart).toEqual(cartProductMock);
    });
  });
});
