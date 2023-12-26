import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from '../category.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryService } from '../category.service';
import { categoryEntityMock } from '../__mocks__/category.mock';
import { ReturnCategoryDto } from '../dtos/returnCategory.dto';
import { createCategoryMock } from '../__mocks__/createCategory.mock';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
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
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should return a list of categories', async () => {
    const categories = await controller.findAllCategories();

    expect(categories).toEqual([new ReturnCategoryDto(categoryEntityMock)]);
  });

  it('should create a new category and return the created one', async () => {
    jest.spyOn(service, 'findCategoryByName').mockResolvedValue(undefined);

    const createCategory = await controller.createCategory(createCategoryMock);

    expect(createCategory).toEqual(categoryEntityMock);
  });
});
