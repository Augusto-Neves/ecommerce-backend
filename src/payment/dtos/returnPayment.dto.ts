import { ReturnPaymentStatusDto } from '../../payment-status/dtos/returnPaymentStatus.dto';
import { PaymentEntity } from '../entities/payment.entity';

export class ReturnPaymentDto {
  id: number;
  status_id: number;
  final_price: number;
  discount: number;
  type: string;
  payment_status?: ReturnPaymentStatusDto;

  constructor(payment: PaymentEntity) {
    this.id = payment.id;
    this.status_id = payment.status_id;
    this.final_price = payment.final_price;
    this.discount = payment.discount;
    this.type = payment.type;
    this.payment_status = payment.payment_status
      ? new ReturnPaymentStatusDto(payment.payment_status)
      : undefined;
  }
}
