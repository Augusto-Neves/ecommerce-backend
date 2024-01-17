import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateOrderDto } from './dtos/createOrder.dto';
import { OrderService } from './order.service';
import { UserId } from '../decorators/user-id.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @UserId() user_id: number,
  ) {
    return this.orderService.createOrder(createOrderDto, user_id);
  }

  @Get()
  async findOrdersByUserId(@UserId() user_id: number) {
    return this.orderService.findOrdersByUserId(user_id);
  }
}
