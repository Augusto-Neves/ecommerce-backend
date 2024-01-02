import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-types.enum';
import { InsertCartDto } from './dtos/insertCart.dto';
import { CartProductService } from '../cart-product/cart-product.service';
import { UpdateCartDto } from './dtos/updateCart.dto';

@Roles(UserType.User)
@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    private readonly cartProductService: CartProductService,
  ) {}

  async clearCart(user_id: number): Promise<UpdateResult> {
    const cart = await this.findCartByUserId(user_id);

    return await this.cartRepository.update(
      { active: cart.active },
      { active: false },
    );
  }

  async findCartByUserId(
    user_id: number,
    hasRelations?: boolean,
  ): Promise<CartEntity> {
    const relations = hasRelations
      ? {
          cart_product: {
            product: true,
          },
        }
      : undefined;

    const cart = await this.cartRepository.findOne({
      where: {
        user_id,
        active: true,
      },
      relations,
    });

    if (!cart) {
      throw new NotFoundException(
        `No one active cart was found for user_id: ${user_id}`,
      );
    }

    return cart;
  }

  async createCart(user_id: number): Promise<CartEntity> {
    const newCart = this.cartRepository.create({
      active: true,
      user_id,
    });

    await this.cartRepository.insert(newCart);

    return newCart;
  }

  async insertCart(
    insertCartDto: InsertCartDto,
    user_id: number,
  ): Promise<CartEntity> {
    const cart = await this.findCartByUserId(user_id).catch(async () => {
      return this.createCart(user_id);
    });

    await this.cartProductService.insertProductInCart(insertCartDto, cart);

    return cart;
  }

  async deleteProductInCart(
    product_id: number,
    user_id: number,
  ): Promise<DeleteResult> {
    const cart = await this.findCartByUserId(user_id);

    return this.cartProductService.deleteProductFromCart(product_id, cart.id);
  }

  async updateProductInCart(
    updateCartDto: UpdateCartDto,
    user_id: number,
  ): Promise<CartEntity> {
    const cart = await this.findCartByUserId(user_id).catch(async () => {
      return this.createCart(user_id);
    });

    await this.cartProductService.updateProductInCart(updateCartDto, cart);

    return cart;
  }
}
