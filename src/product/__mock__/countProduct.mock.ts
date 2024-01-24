import { categoryEntityMock } from '../../category/__mocks__/category.mock';
import { CountProductDto } from '../dtos/countProduct.dto';

export const countProductDtoMock: CountProductDto = {
  category_id: categoryEntityMock.id,
  total: 12,
};
