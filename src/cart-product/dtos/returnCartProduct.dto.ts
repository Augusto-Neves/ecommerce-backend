import { ReturnCartDto } from '../../cart/dtos/returnCart.dto';
import { ReturnProductDto } from '../../product/dtos/returnProduct.dto';
import { CartProductEntity } from '../entities/cart-product.entity';

export class ReturnCartProductDto {
  id: number;
  cart_id: number;
  product_id: number;
  amount: number;
  product?: ReturnProductDto;
  cart?: ReturnCartDto;

  constructor(cartProduct: CartProductEntity) {
    this.id = cartProduct.id;
    this.amount = cartProduct.amount;
    this.cart_id = cartProduct.cart_id;
    this.cart = cartProduct.cart
      ? new ReturnCartDto(cartProduct.cart)
      : undefined;
    this.product_id = cartProduct.product_id;
    this.product = cartProduct.product
      ? new ReturnProductDto(cartProduct.product)
      : undefined;
  }
}
