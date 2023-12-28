import { UpdateProductDto } from '../dtos/updateProduct.dto';
import { productMock } from './product.mock';

export const updateProductMock: UpdateProductDto = {
  name: 'nome editado',
  image: productMock.image,
  category_id: productMock.category_id,
  price: productMock.price,
};
