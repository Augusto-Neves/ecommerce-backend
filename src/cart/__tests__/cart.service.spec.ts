import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../cart.service';
import { CartEntity } from '../entities/cart.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartProductService } from '../../cart-product/cart-product.service';
import { returnUpdateMock } from '../../__mocks__/returnUpdate.mock';
import { cartEntityMock } from '../__mocks__/cartEntity.mock';
import { returnInsertMock } from '../../__mocks__/returnInsert.mock';
import { cartProductMock } from '../../cart-product/__mocks__/cartProduct.mock';
import { insertCartDtoMock } from '../__mocks__/insertCartDto.mock';
import { returnDeleteMock } from '../../__mocks__/returnDelete.mock';
import { updateCartDtoMock } from '../__mocks__/updateCartDto.mock';

describe('CartService', () => {
  let service: CartService;
  let cartRepository: Repository<CartEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(CartEntity),
          useValue: {
            create: jest.fn().mockResolvedValue(cartEntityMock),
            findOne: jest.fn().mockResolvedValue(cartEntityMock),
            insert: jest.fn().mockResolvedValue(returnInsertMock),
            update: jest.fn().mockResolvedValue(returnUpdateMock),
          },
        },
        {
          provide: CartProductService,
          useValue: {
            insertProductInCart: jest.fn().mockResolvedValue(cartProductMock),
            deleteProductFromCart: jest
              .fn()
              .mockResolvedValue(returnDeleteMock),
            updateProductCart: jest.fn().mockResolvedValue(cartEntityMock),
          },
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartRepository = module.get<Repository<CartEntity>>(
      getRepositoryToken(CartEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cartRepository).toBeDefined();
  });

  describe('clearCart', () => {
    it('should return an error if user has not active cart', async () => {
      jest.spyOn(service, 'findCartByUserId').mockRejectedValue(new Error());

      const clearCart = service.clearCart(cartEntityMock.user_id);

      expect(clearCart).rejects.toThrow();
    });

    it('should turn cart into a inactive cart', async () => {
      const clearCart = await service.clearCart(cartEntityMock.user_id);

      expect(clearCart).toEqual(returnUpdateMock);
    });
  });

  describe('findCartByUserId', () => {
    it('should return an error if user has no one active cart', () => {
      jest.spyOn(cartRepository, 'findOne').mockResolvedValue(undefined);

      const userCart = service.findCartByUserId(cartEntityMock.user_id, true);

      expect(userCart).rejects.toThrow();
    });

    it('should return an active cart', async () => {
      const userCart = await service.findCartByUserId(
        cartEntityMock.user_id,
        true,
      );

      expect(userCart).toEqual(cartEntityMock);
    });
  });

  describe('createCart', () => {
    it('should create a new cart', async () => {
      const newCart = await service.createCart(cartEntityMock.user_id);

      expect(newCart).toEqual(cartEntityMock);
    });
  });

  describe('insertCart', () => {
    it('should create a new cart if user does not an active cart', async () => {
      jest.spyOn(service, 'findCartByUserId').mockRejectedValue(new Error());

      const insertInCart = await service.insertCart(
        insertCartDtoMock,
        cartEntityMock.user_id,
      );

      expect(insertInCart).toEqual(cartEntityMock);
    });

    it('should insert a new cart', async () => {
      const insertInCart = await service.insertCart(
        insertCartDtoMock,
        cartEntityMock.user_id,
      );

      expect(insertInCart).toEqual(cartEntityMock);
    });
  });

  describe('deleteProductInCart', () => {
    it('should delete product from cart', async () => {
      const deleteProductInCart = await service.deleteProductInCart(
        cartProductMock.product_id,
        cartEntityMock.user_id,
      );

      expect(deleteProductInCart).toEqual(returnDeleteMock);
    });
  });

  describe('updateProductInCart', () => {
    it('should create a new cart if user does not have a cart', async () => {
      jest.spyOn(service, 'findCartByUserId').mockRejectedValue(new Error());

      const updateProductInCart = await service.updateProductInCart(
        updateCartDtoMock,
        cartEntityMock.user_id,
      );

      expect(updateProductInCart).toEqual(cartEntityMock);
    });

    it('should update a cart', async () => {
      const updateProductInCart = await service.updateProductInCart(
        updateCartDtoMock,
        cartEntityMock.user_id,
      );

      expect(updateProductInCart).toEqual(cartEntityMock);
    });
  });
});
