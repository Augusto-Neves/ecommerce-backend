import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { ProductEntity } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository } from 'typeorm';
import { CreateProductDto } from './dtos/createProduct.dto';
import { CategoryService } from '../category/category.service';
import { UpdateProductDto } from './dtos/updateProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoryService,
  ) {}

  async getAllProducts(product_ids?: number[]): Promise<ProductEntity[]> {
    let findOptions = {};

    if (product_ids && product_ids.length > 0) {
      findOptions = {
        where: {
          id: In(product_ids),
        },
      };
    }
    const products = await this.productRepository.find(findOptions);

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

  async findProductById(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product id: ${id} not found`);
    }

    return product;
  }

  async deleteProduct(product_id: number): Promise<DeleteResult> {
    await this.findProductById(product_id);

    return this.productRepository.delete({ id: product_id });
  }

  async updateProduct(
    updateProduct: UpdateProductDto,
    product_id: number,
  ): Promise<ProductEntity> {
    const product = await this.findProductById(product_id);

    return this.productRepository.save({ ...product, ...updateProduct });
  }
}
