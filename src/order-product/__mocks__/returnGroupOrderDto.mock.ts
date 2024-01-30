import { orderEntityMock } from '../../order/__mocks__/orderEntity.mock';
import { ReturnGroupOrderDto } from '../dtos/returnGroupOrder.dto';
import { orderProductEntityMock } from './orderProductEntity.mock';

export const returnGroupOrderDtoMock: ReturnGroupOrderDto = {
  order_id: orderEntityMock.id,
  total: orderProductEntityMock.amount.toString(),
};
