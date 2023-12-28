import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../product.controller';
import { ProductService } from '../product.service';
import { productMock } from '../__mock__/product.mock';
import { ReturnProductDto } from '../dtos/returnProduct.dto';
import { returnDeleteMock } from '../../__mocks__/returnDelete.mock';
import { createProductMock } from '../__mock__/createProduct.mock';

describe('ProductController', () => {
  let controller: ProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        ProductService,
        {
          provide: ProductService,
          useValue: {
            getAllProducts: jest.fn().mockResolvedValue([productMock]),
            createProduct: jest.fn().mockResolvedValue(productMock),
            deleteProduct: jest.fn().mockResolvedValue(returnDeleteMock),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all products', async () => {
    const products = await controller.getAllProducts();

    expect(products).toEqual([new ReturnProductDto(productMock)]);
  });

  it('should create a new product', async () => {
    const newProduct = await controller.createProduct(createProductMock);

    expect(newProduct).toEqual(productMock);
  });

  it('should delete a product', async () => {
    const deleteProduct = await controller.deleteProduct(
      productMock.category_id,
    );

    expect(deleteProduct).toEqual(returnDeleteMock);
  });
});
