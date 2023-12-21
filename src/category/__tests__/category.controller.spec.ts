import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from '../category.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryService } from '../category.service';
import { categoryEntityMock } from '../__mocks__/category.mock';
import { ReturnCategoryDto } from '../dtos/returnCategory.dto';

describe('CategoryController', () => {
  let controller: CategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([categoryEntityMock]),
            save: jest.fn().mockResolvedValue(categoryEntityMock),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a list of categories', async () => {
    const categories = await controller.findAllCategories();

    expect(categories).toEqual([new ReturnCategoryDto(categoryEntityMock)]);
  });
});
