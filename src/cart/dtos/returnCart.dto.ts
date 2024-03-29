import { ReturnCartProductDto } from '../../cart-product/dtos/returnCartProduct.dto';
import { CartEntity } from '../entities/cart.entity';

export class ReturnCartDto {
  id: number;
  cartProduct?: ReturnCartProductDto[];

  constructor(cart: CartEntity) {
    this.id = cart.id;
    this.cartProduct = cart.cart_product
      ? cart.cart_product.map(
          (cartProduct) => new ReturnCartProductDto(cartProduct),
        )
      : undefined;
  }
}
