import { addressMock } from '../../address/__mocks__/address.mock';
import { CreateOrderDto } from '../dtos/createOrder.dto';

export const createOrderDtoWithCardMock: CreateOrderDto = {
  address_id: addressMock.id,
  amount_payments: 2,
};

export const createOrderDtoWithPix: CreateOrderDto = {
  address_id: addressMock.id,
  code_pix: 'code-pix-mock',
  date_payment: '2024-01-09',
};

export const createOrderDtoWithError: CreateOrderDto = {
  address_id: addressMock.id,
};
