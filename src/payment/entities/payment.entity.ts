import { OrderEntity } from '../../order/entities/order.entity';
import { PaymentStatusEntity } from '../../payment-status/entities/payment-status.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';

@Entity({ name: 'payment' })
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class PaymentEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'status_id', nullable: false })
  status_id: number;

  @Column({ name: 'price', nullable: false })
  price: number;

  @Column({ name: 'discount', nullable: false })
  discount: number;

  @Column({ name: 'final_price', nullable: false })
  final_price: number;

  @Column({ name: 'type', nullable: false })
  type: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Column({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => OrderEntity, (order) => order.payment)
  orders?: OrderEntity[];

  @ManyToOne(() => PaymentStatusEntity, (status) => status.payments)
  @JoinColumn({ name: 'status_id', referencedColumnName: 'id' })
  payment_status?: PaymentStatusEntity;

  constructor(
    status_id: number,
    price: number,
    discount: number,
    final_price: number,
  ) {
    this.status_id = status_id;
    this.price = price;
    this.discount = discount;
    this.final_price = final_price;
  }
}
