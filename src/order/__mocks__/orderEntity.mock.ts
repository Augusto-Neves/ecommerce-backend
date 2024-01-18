import { addressMock } from '../../address/__mocks__/address.mock';
import { OrderEntity } from '../entities/order.entity';
import { paymentMock } from '../../payment/__mocks__/payment.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';

export const orderEntityMock: OrderEntity = {
  address_id: addressMock.id,
  created_at: new Date(),
  date: new Date(),
  id: 432,
  payment_id: paymentMock.id,
  updated_at: new Date(),
  user_id: userEntityMock.id,
};
