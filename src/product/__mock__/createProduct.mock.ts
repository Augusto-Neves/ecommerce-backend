import { CreateProductDto } from '../dtos/createProduct.dto';
import { productMock } from './product.mock';

export const createProductMock: CreateProductDto = {
  name: productMock.name,
  image: productMock.image,
  category_id: productMock.category_id,
  price: productMock.price,
};
