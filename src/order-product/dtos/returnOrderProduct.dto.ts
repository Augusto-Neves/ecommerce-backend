import { ReturnOrderDto } from '../../order/dtos/returnOrder.dto';
import { ReturnProductDto } from '../../product/dtos/returnProduct.dto';
import { OrderProductEntity } from '../entities/order-product.entity';

export class ReturnOrderProductDto {
  id: number;
  order_id: number;
  product_id: number;
  amount: number;
  price: number;
  order?: ReturnOrderDto;
  product?: ReturnProductDto;

  constructor(orderProduct: OrderProductEntity) {
    this.id = orderProduct.id;
    this.order_id = orderProduct.order_id;
    this.product_id = orderProduct.product_id;
    this.amount = orderProduct.amount;
    this.price = orderProduct.price;
    this.order = orderProduct.order
      ? new ReturnOrderDto(orderProduct.order)
      : undefined;
    this.product = orderProduct.product
      ? new ReturnProductDto(orderProduct.product)
      : undefined;
  }
}
