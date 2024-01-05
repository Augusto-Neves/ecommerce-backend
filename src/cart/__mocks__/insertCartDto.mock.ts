import { productMock } from '../../product/__mock__/product.mock';
import { InsertCartDto } from '../dtos/insertCart.dto';

export const insertCartDtoMock: InsertCartDto = {
  amount: 1,
  product_id: productMock.id,
};
