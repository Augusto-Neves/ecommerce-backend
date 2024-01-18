import { PaymentPixEntity } from '../entities/payment-pix.entity';
import { paymentMock } from './payment.mock';

export const paymentPixMock: PaymentPixEntity = {
  ...paymentMock,
  code: 'code-pix-mock',
  date_payment: new Date(),
  type: 'PaymentPixEntity',
};
