import { OrderProductEntity } from '../entities/order-product.entity';
import { productMock } from '../../product/__mock__/product.mock';

export const orderProductEntityMock: OrderProductEntity = {
  amount: 3,
  created_at: new Date(),
  id: 123,
  order_id: 234,
  price: productMock.price,
  product_id: productMock.id,
  updated_at: new Date(),
};
