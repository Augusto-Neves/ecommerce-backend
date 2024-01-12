import { ChildEntity, Column } from 'typeorm';
import { PaymentEntity } from './payment.entity';
import { CreateOrderDto } from '../../order/dtos/createOrder.dto';

@ChildEntity()
export class PaymentPixEntity extends PaymentEntity {
  @Column({ name: 'code', nullable: false })
  code: string;

  @Column({ name: 'date_payment', nullable: false })
  date_payment: Date;

  constructor(
    statusId: number,
    price: number,
    discount: number,
    finalPrice: number,
    createOrderDTO: CreateOrderDto,
  ) {
    super(statusId, price, discount, finalPrice);
    this.code = createOrderDTO?.code_pix || '';
    this.date_payment = new Date(createOrderDTO?.date_payment || '');
  }
}
