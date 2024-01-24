import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../category.service';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { categoryEntityMock } from '../__mocks__/category.mock';
import { createCategoryMock } from '../__mocks__/createCategory.mock';
import { ProductService } from '../../product/product.service';
import { countProductDtoMock } from '../../product/__mock__/countProduct.mock';
import { ReturnCategoryDto } from '../dtos/returnCategory.dto';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<CategoryEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([categoryEntityMock]),
            findOne: jest.fn().mockResolvedValue(categoryEntityMock),
            create: jest.fn().mockResolvedValue(categoryEntityMock),
            insert: jest.fn().mockResolvedValue({}),
          },
        },

        {
          provide: ProductService,
          useValue: {
            countProductByCategoryId: jest
              .fn()
              .mockResolvedValue([countProductDtoMock]),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<Repository<CategoryEntity>>(
      getRepositoryToken(CategoryEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryRepository).toBeDefined();
  });

  describe('findAllCategories', () => {
    it('should return a list of categories', async () => {
      const categories = await service.findAllCategories();

      expect(categories).toEqual([
        new ReturnCategoryDto(categoryEntityMock, countProductDtoMock.total),
      ]);
    });

    it('should return an error if list of categories is empty', async () => {
      jest.spyOn(categoryRepository, 'find').mockResolvedValue([]);

      const categories = service.findAllCategories();

      expect(categories).rejects.toThrow();
    });

    it('should return an error if something went wrong in database', async () => {
      jest.spyOn(categoryRepository, 'find').mockRejectedValue(new Error());

      const categories = service.findAllCategories();

      expect(categories).rejects.toThrow();
    });
  });

  describe('createCategory', () => {
    it('should return a category after create a new category', async () => {
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined);

      const category = await service.createCategory(createCategoryMock);

      expect(category).toEqual(categoryEntityMock);
    });

    it('should return an error if occurred an exception', async () => {
      jest.spyOn(categoryRepository, 'insert').mockRejectedValue(new Error());

      const category = service.createCategory(createCategoryMock);

      expect(category).rejects.toThrow();
    });
  });

  describe('findCategoryByName', () => {
    it('should return a category searched by your name', async () => {
      const category = await service.findCategoryByName(
        createCategoryMock.name,
      );

      expect(category).toEqual(categoryEntityMock);
    });

    it('should return an error if category is not found by your name', () => {
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined);

      const category = service.findCategoryByName(createCategoryMock.name);

      expect(category).rejects.toThrow();
    });
  });

  describe('findCategoryById', () => {
    it('should return an category when it searched by category_id', async () => {
      const category = await service.findByCategoryId(categoryEntityMock.id);

      expect(category).toEqual(categoryEntityMock);
    });

    it('should return an error when category is not found', async () => {
      jest.spyOn(categoryRepository, 'findOne').mockReturnValue(undefined);

      const category = service.findByCategoryId(categoryEntityMock.id);

      expect(category).rejects.toThrow();
    });
  });
});
