import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartProductEntity } from './entities/cart-product.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InsertCartDto } from '../cart/dtos/insertCart.dto';
import { CartEntity } from '../cart/entities/cart.entity';
import { ProductService } from '../product/product.service';
import { UpdateCartDto } from '../cart/dtos/updateCart.dto';

@Injectable()
export class CartProductService {
  constructor(
    @InjectRepository(CartProductEntity)
    private readonly cartProductRepository: Repository<CartProductEntity>,
    private readonly productService: ProductService,
  ) {}

  async verifyProductInCart(
    product_id: number,
    cart_id: number,
  ): Promise<CartProductEntity> {
    const cartProduct = await this.cartProductRepository.findOne({
      where: {
        cart_id,
        product_id,
      },
    });

    if (!cartProduct) {
      throw new NotFoundException('Product not found in cart');
    }

    return cartProduct;
  }

  async createProductInCart(
    insertCartDto: InsertCartDto,
    cart_id: number,
  ): Promise<CartProductEntity> {
    const newProductInCart = this.cartProductRepository.create({
      amount: insertCartDto.amount,
      product_id: insertCartDto.product_id,
      cart_id,
    });

    await this.cartProductRepository.insert(newProductInCart);

    return newProductInCart;
  }

  async insertProductInCart(
    insertCartDto: InsertCartDto,
    cart: CartEntity,
  ): Promise<CartProductEntity> {
    await this.productService.findProductById(insertCartDto.product_id);

    const cartProduct: CartProductEntity = await this.verifyProductInCart(
      insertCartDto.product_id,
      cart.id,
    ).catch(() => undefined);

    if (!cartProduct) {
      return this.createProductInCart(insertCartDto, cart.id);
    }

    await this.cartProductRepository.update(
      { amount: cartProduct.amount },
      {
        amount: cartProduct.amount + insertCartDto.amount,
      },
    );

    return cartProduct;
  }

  async deleteProductFromCart(
    product_id: number,
    cart_id: number,
  ): Promise<DeleteResult> {
    return this.cartProductRepository.delete({
      product_id,
      cart_id,
    });
  }

  async updateProductCart(
    updateCartDto: UpdateCartDto,
    cart: CartEntity,
  ): Promise<CartProductEntity> {
    await this.productService.findProductById(updateCartDto.product_id);

    const cartProduct: CartProductEntity = await this.verifyProductInCart(
      updateCartDto.product_id,
      cart.id,
    );

    await this.cartProductRepository.update(
      { amount: cartProduct.amount },
      {
        amount: updateCartDto.amount,
      },
    );

    return cartProduct;
  }
}
