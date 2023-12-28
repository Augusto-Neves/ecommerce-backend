import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductEntity } from '../entities/product.entity';
import { productMock } from '../__mock__/product.mock';
import { createProductMock } from '../__mock__/createProduct.mock';
import { CategoryService } from '../../category/category.service';
import { categoryEntityMock } from '../../category/__mocks__/category.mock';
import { returnDeleteMock } from '../../__mocks__/returnDelete.mock';
import { updateProductMock } from '../__mock__/updateProduct.mock';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<ProductEntity>;
  let categoryService: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {
            create: jest.fn().mockResolvedValue(productMock),
            delete: jest.fn().mockResolvedValue(returnDeleteMock),
            find: jest.fn().mockResolvedValue([productMock]),
            findOne: jest.fn().mockResolvedValue(productMock),
            insert: jest.fn().mockResolvedValue({}),
            save: jest.fn().mockResolvedValue(updateProductMock),
          },
        },
        {
          provide: CategoryService,
          useValue: {
            findByCategoryId: jest.fn().mockResolvedValue(categoryEntityMock),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    categoryService = module.get<CategoryService>(CategoryService);
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryService).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const products = await service.getAllProducts();

      expect(products).toEqual([productMock]);
    });

    it('should return an error if no products are found', async () => {
      jest.spyOn(productRepository, 'find').mockResolvedValue([]);

      const products = service.getAllProducts();

      expect(products).rejects.toThrow();
    });

    it('should return an exception if something went wrong', async () => {
      jest.spyOn(productRepository, 'find').mockRejectedValue(new Error());

      const products = service.getAllProducts();

      expect(products).rejects.toThrow();
    });
  });

  describe('createProduct', () => {
    it('should create a new product and return a productEntity', async () => {
      const newProduct = await service.createProduct(createProductMock);

      expect(newProduct).toEqual(productMock);
    });

    it('should return an error if the category is not found', async () => {
      jest
        .spyOn(categoryService, 'findByCategoryId')
        .mockRejectedValue(new Error());

      const product = service.createProduct(createProductMock);

      expect(product).rejects.toThrow();
    });
  });

  describe('findProductById', () => {
    it('should return a product when is searched by id', async () => {
      const product = await service.findProductById(productMock.id);

      expect(product).toEqual(productMock);
    });

    it('should return an error if product is not found by id', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

      const product = service.findProductById(productMock.id);

      expect(product).rejects.toThrow();
    });
  });

  describe('deleteProduct', () => {
    it('should return an error if product is not found', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

      const deleteProduct = service.deleteProduct(productMock.id);

      expect(deleteProduct).rejects.toThrow();
    });

    it('should delete a product', async () => {
      const deleteProduct = await service.deleteProduct(productMock.id);

      expect(deleteProduct).toEqual(returnDeleteMock);
    });
  });

  describe('updateProduct', () => {
    it('should return an error if the product id is not found', () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(undefined);

      const updateProduct = service.updateProduct(
        updateProductMock,
        productMock.id,
      );

      expect(updateProduct).rejects.toThrow();
    });

    it('should update a product', async () => {
      const updateProduct = await service.updateProduct(
        updateProductMock,
        productMock.id,
      );

      expect(updateProduct).toEqual(updateProduct);
    });
  });
});
