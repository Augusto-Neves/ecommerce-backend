import { ReturnAddressDto } from '../../address/dto/returnAddress.dto';
import { ReturnUserDto } from '../../user/dtos/returnUser.dto';
import { OrderEntity } from '../entities/order.entity';
import { ReturnPaymentDto } from '../../payment/dtos/returnPayment.dto';
import { ReturnOrderProductDto } from '../../order-product/dtos/returnOrderProduct.dto';

export class ReturnOrderDto {
  id: number;
  date: string;
  user_id: number;
  address_id: number;
  payment_id: number;
  user?: ReturnUserDto;
  address?: ReturnAddressDto;
  payment?: ReturnPaymentDto;
  orders_product?: ReturnOrderProductDto[];
  amount_products?: number;

  constructor(order: OrderEntity) {
    this.id = order.id;
    this.date = order.date.toISOString();
    this.user_id = order.user_id;
    this.address_id = order.address_id;
    this.payment_id = order.payment_id;
    this.user = order.user ? new ReturnUserDto(order.user) : undefined;
    this.address = order.address
      ? new ReturnAddressDto(order.address)
      : undefined;
    this.payment = order.payment
      ? new ReturnPaymentDto(order.payment)
      : undefined;
    this.orders_product = order.orders_product
      ? order.orders_product.map(
          (order_product) => new ReturnOrderProductDto(order_product),
        )
      : undefined;
    this.amount_products = order.amount_products
      ? order.amount_products
      : undefined;
  }
}
