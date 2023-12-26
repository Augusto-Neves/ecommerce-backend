import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../product.controller';
import { ProductService } from '../product.service';
import { productMock } from '../__mock__/product.mock';
import { ReturnProductDto } from '../dtos/returnProduct.dto';

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
});
