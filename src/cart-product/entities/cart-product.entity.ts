import { CartEntity } from '../../cart/entities/cart.entity';
import { ProductEntity } from '../../product/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'cart_product' })
export class CartProductEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'cart_id', nullable: false })
  cart_id: number;

  @Column({ name: 'product_id', nullable: false })
  product_id: number;

  @Column({ name: 'amount', nullable: false })
  amount: number;

  @Column({ name: 'active', nullable: false })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @ManyToOne(
    () => ProductEntity,
    (product: ProductEntity) => product.cart_product,
  )
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product?: ProductEntity;

  @ManyToOne(() => CartEntity, (cart: CartEntity) => cart.cart_product)
  @JoinColumn({ name: 'cart_id', referencedColumnName: 'id' })
  cart?: CartEntity;
}
