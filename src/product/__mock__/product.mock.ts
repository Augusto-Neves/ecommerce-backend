import { ProductEntity } from '../entities/product.entity';

export const productMock: ProductEntity = {
  category_id: 2,
  created_at: new Date(),
  id: 125,
  image: 'https://placehold.it/350x300',
  name: 'Product Mock',
  price: 34.3,
  updated_at: new Date(),
};
