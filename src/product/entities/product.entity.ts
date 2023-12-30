import { CartProductEntity } from '../../cart-product/entities/cart-product.entity';
import { CategoryEntity } from '../../category/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'product' })
export class ProductEntity {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ name: 'category_id', nullable: false })
  category_id: number;

  @Column({ name: 'price', nullable: false })
  price: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'image', nullable: false })
  image: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(
    () => CartProductEntity,
    (cart_product: CartProductEntity) => cart_product.product,
  )
  cart_product?: CartProductEntity[];

  @ManyToOne(
    () => CategoryEntity,
    (category: CategoryEntity) => category.products,
  )
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category?: CategoryEntity;
}
