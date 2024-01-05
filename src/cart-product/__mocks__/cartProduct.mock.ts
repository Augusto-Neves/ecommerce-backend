import { cartEntityMock } from '../../cart/__mocks__/cartEntity.mock';
import { CartProductEntity } from '../entities/cart-product.entity';
import { productMock } from '../../product/__mock__/product.mock';

export const cartProductMock: CartProductEntity = {
  amount: 10,
  cart_id: 1,
  created_at: new Date(),
  id: 1,
  product_id: productMock.id,
  updated_at: new Date(),
  cart: cartEntityMock,
  product: productMock,
};
