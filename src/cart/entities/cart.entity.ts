import { CartProductEntity } from '../../cart-product/entities/cart-product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'cart' })
export class CartEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'user_id', nullable: false })
  user_id: number;

  @Column({ name: 'active', nullable: false })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(
    () => CartProductEntity,
    (cart_product: CartProductEntity) => cart_product.cart,
  )
  cart_product?: CartProductEntity[];
}
