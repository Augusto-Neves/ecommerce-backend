import { AddressEntity } from '../../address/entities/address.entity';
import { OrderProductEntity } from '../../order-product/entities/order-product.entity';
import { PaymentEntity } from '../../payment/entities/payment.entity';
import { UserEntity } from '../../user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'order' })
export class OrderEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'user_id', nullable: false })
  user_id: number;

  @Column({ name: 'date', nullable: false })
  date: Date;

  @Column({ name: 'address_id', nullable: false })
  address_id: number;

  @Column({ name: 'payment_id', nullable: false })
  payment_id: number;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: UserEntity;

  @ManyToOne(() => AddressEntity, (address) => address.orders)
  @JoinColumn({ name: 'address_id', referencedColumnName: 'id' })
  address?: AddressEntity;

  @ManyToOne(() => PaymentEntity, (payment) => payment.orders)
  @JoinColumn({ name: 'payment_id', referencedColumnName: 'id' })
  payment?: PaymentEntity;

  @OneToMany(() => OrderProductEntity, (orders_product) => orders_product.order)
  orders_product?: OrderProductEntity[];
}
