import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from '../cart.controller';
import { CartService } from '../cart.service';
import { cartEntityMock } from '../__mocks__/cartEntity.mock';
import { returnUpdateMock } from '../../__mocks__/returnUpdate.mock';
import { insertCartDtoMock } from '../__mocks__/insertCartDto.mock';
import { ReturnCartDto } from '../dtos/returnCart.dto';
import { returnDeleteMock } from '../../__mocks__/returnDelete.mock';
import { productMock } from '../../product/__mock__/product.mock';
import { updateCartDtoMock } from '../__mocks__/updateCartDto.mock';

describe('CartController', () => {
  let controller: CartController;
  let service: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: {
            insertCart: jest.fn().mockResolvedValue(cartEntityMock),
            findCartByUserId: jest.fn().mockResolvedValue(cartEntityMock),
            clearCart: jest.fn().mockResolvedValue(returnUpdateMock),
            deleteProductInCart: jest.fn().mockResolvedValue(returnDeleteMock),
            updateProductInCart: jest.fn().mockResolvedValue(cartEntityMock),
          },
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should insert product into cart', async () => {
    const newProductInCart = await controller.insertInCart(
      cartEntityMock.user_id,
      insertCartDtoMock,
    );

    expect(newProductInCart).toEqual(new ReturnCartDto(cartEntityMock));
  });

  it('should find user cart by id', async () => {
    const userCart = await controller.findCartByUserId(cartEntityMock.user_id);

    expect(userCart).toEqual(new ReturnCartDto(cartEntityMock));
  });

  it('should clear user cart', async () => {
    const clearCart = await controller.clearCart(cartEntityMock.user_id);

    expect(clearCart).toEqual(returnUpdateMock);
  });

  it('should delete a product from cart', async () => {
    const deleteProduct = await controller.deleteProductFromCart(
      productMock.id,
      cartEntityMock.user_id,
    );

    expect(deleteProduct).toEqual(returnDeleteMock);
  });

  it('should update a product from cart', async () => {
    const updateProduct = await controller.updateProductInCart(
      updateCartDtoMock,
      cartEntityMock.user_id,
    );

    expect(updateProduct).toEqual(new ReturnCartDto(cartEntityMock));
  });
});
