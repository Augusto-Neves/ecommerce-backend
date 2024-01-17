import { PaymentType } from '../../payment-status/enum/payment-type.enum';
import { PaymentEntity } from '../entities/payment.entity';

export const paymentMock: PaymentEntity = {
  created_at: new Date(),
  discount: 15,
  final_price: 150,
  id: 156,
  price: 50,
  status_id: PaymentType.Done,
  type: 'PaymentCartEntity',
  updated_at: new Date(),
};
