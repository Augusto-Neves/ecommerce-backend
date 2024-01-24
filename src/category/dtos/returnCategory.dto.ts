import { CategoryEntity } from '../entities/category.entity';

export class ReturnCategoryDto {
  id: number;
  name: string;
  amount_products?: number;

  constructor(categoryEntity: CategoryEntity, amount_products?: number) {
    this.id = categoryEntity.id;
    this.name = categoryEntity.name;
    this.amount_products = Number(amount_products);
  }
}
