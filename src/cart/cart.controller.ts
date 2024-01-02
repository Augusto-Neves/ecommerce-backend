import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-types.enum';
import { InsertCartDto } from './dtos/insertCart.dto';
import { UserId } from '../decorators/user-id.decorator';
import { ReturnCartDto } from './dtos/returnCart.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateCartDto } from './dtos/updateCart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Roles(UserType.User)
  @Post()
  async insertInCart(
    @UserId() user_id: number,
    @Body() insertCartDto: InsertCartDto,
  ): Promise<ReturnCartDto> {
    const cart = await this.cartService.insertCart(insertCartDto, user_id);

    return new ReturnCartDto(cart);
  }

  @Roles(UserType.Admin, UserType.User)
  @Get()
  async findCartByUserId(@UserId() user_id: number): Promise<ReturnCartDto> {
    const cart = await this.cartService.findCartByUserId(user_id, true);

    return new ReturnCartDto(cart);
  }

  @Roles(UserType.User, UserType.Admin)
  @Delete()
  async clearCart(@UserId() user_id: number): Promise<UpdateResult> {
    return this.cartService.clearCart(user_id);
  }

  @Roles(UserType.Admin, UserType.User)
  @Delete('/product/:productId')
  async deleteProductFromCart(
    @Param('productId') product_id: number,
    @UserId() user_id: number,
  ): Promise<DeleteResult> {
    return this.cartService.deleteProductInCart(product_id, user_id);
  }

  @Roles(UserType.Admin, UserType.User)
  @Patch()
  async updateProductInCart(
    @Body() updatedCartDto: UpdateCartDto,
    @UserId() user_id: number,
  ): Promise<ReturnCartDto> {
    const updatedCart = await this.cartService.updateProductInCart(
      updatedCartDto,
      user_id,
    );

    return new ReturnCartDto(updatedCart);
  }
}
