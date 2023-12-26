import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { ProductEntity } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/createProduct.dto';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoryService,
  ) {}

  async getAllProducts(): Promise<ProductEntity[]> {
    const products = await this.productRepository.find();

    if (products.length === 0 || !products) {
      throw new NotFoundException('No products found');
    }

    return products;
  }

  async createProduct(
    @Body() createProduct: CreateProductDto,
  ): Promise<ProductEntity> {
    await this.categoryService.findByCategoryId(createProduct.category_id);

    const newProduct = this.productRepository.create(createProduct);

    await this.productRepository.insert(newProduct);

    return newProduct;
  }
}
