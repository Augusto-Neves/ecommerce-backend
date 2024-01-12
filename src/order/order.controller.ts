import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateOrderDto } from './dtos/createOrder.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/cart/:cartId')
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Param('cartId') cart_id: number,
  ) {
    return this.orderService.createOrder(createOrderDto, cart_id);
  }
}
