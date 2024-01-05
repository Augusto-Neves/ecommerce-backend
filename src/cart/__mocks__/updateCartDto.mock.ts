import { productMock } from '../../product/__mock__/product.mock';
import { UpdateCartDto } from '../dtos/updateCart.dto';

export const updateCartDtoMock: UpdateCartDto = {
  amount: 2,
  product_id: productMock.id,
};
