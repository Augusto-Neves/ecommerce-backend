import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ReturnCategoryDto } from './dtos/returnCategory.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-types.enum';
import { CreateCategoryDto } from './dtos/createteCategory.dto';
import { CategoryEntity } from './entities/category.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(UserType.Admin, UserType.User)
  @Get()
  async findAllCategories(): Promise<ReturnCategoryDto[]> {
    const categories = (await this.categoryService.findAllCategories()).map(
      (category) => new ReturnCategoryDto(category),
    );

    return categories;
  }

  @Roles(UserType.Admin)
  @Post()
  async createCategory(
    @Body() createCategory: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    return this.categoryService.createCategory(createCategory);
  }
}
