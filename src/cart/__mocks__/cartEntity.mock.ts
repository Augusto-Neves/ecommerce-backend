import { userEntityMock } from '../../user/__mocks__/user.mock';
import { cartProductMock } from '../../cart-product/__mocks__/cartProduct.mock';
import { CartEntity } from '../entities/cart.entity';

export const cartEntityMock: CartEntity = {
  active: true,
  created_at: new Date(),
  id: 1,
  updated_at: new Date(),
  user_id: userEntityMock.id,
  cart_product: [cartProductMock],
};
