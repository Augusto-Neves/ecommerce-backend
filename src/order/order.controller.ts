import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateOrderDto } from './dtos/createOrder.dto';
import { OrderService } from './order.service';
import { UserId } from '../decorators/user-id.decorator';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-types.enum';
import { ReturnOrderDto } from './dtos/returnOrder.dto';

@Roles(UserType.Admin, UserType.User)
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

  @Roles(UserType.Admin)
  @Get('/all')
  async findAllOrders(): Promise<ReturnOrderDto[]> {
    const allOrder = await this.orderService.findAllOrders();

    return allOrder.map((order) => new ReturnOrderDto(order));
  }

  @Roles(UserType.Admin)
  @Get('/:orderId')
  async findByOrderId(
    @Param('orderId') order_id: number,
  ): Promise<ReturnOrderDto> {
    const order = await this.orderService.findByOrderId(order_id);

    return new ReturnOrderDto(order);
  }
}
