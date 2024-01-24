import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dtos/createteCategory.dto';
import { ProductService } from '../product/product.service';
import { ReturnCategoryDto } from './dtos/returnCategory.dto';
import { CountProductDto } from '../product/dtos/countProduct.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
  ) {}

  findAmountCategoryInProducts(
    category: CategoryEntity,
    countList: CountProductDto[],
  ): number {
    const count = countList.find(
      (itemCount) => itemCount.category_id === category.id,
    );

    if (count) {
      return count.total;
    }

    return 0;
  }

  async findAllCategories(): Promise<ReturnCategoryDto[]> {
    const categories = await this.categoryRepository.find();

    const count = await this.productService.countProductByCategoryId();

    if (!categories || categories.length === 0) {
      throw new NotFoundException('Category is empty');
    }

    return categories.map(
      (category) =>
        new ReturnCategoryDto(
          category,
          this.findAmountCategoryInProducts(category, count),
        ),
    );
  }

  async createCategory(
    createCategory: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const category = await this.findCategoryByName(createCategory.name).catch(
      () => undefined,
    );

    if (category) {
      throw new BadRequestException(
        `Category '${createCategory.name}' already exists`,
      );
    }

    const newCategory = this.categoryRepository.create(createCategory);

    await this.categoryRepository.insert(newCategory);

    return newCategory;
  }

  async findCategoryByName(name: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: {
        name,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category ${name} not found`);
    }

    return category;
  }

  async findByCategoryId(category_id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: {
        id: category_id,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }
}
