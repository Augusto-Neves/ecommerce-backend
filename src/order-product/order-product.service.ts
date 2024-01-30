import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderProductEntity } from './entities/order-product.entity';
import { ReturnGroupOrderDto } from './dtos/returnGroupOrder.dto';

@Injectable()
export class OrderProductService {
  constructor(
    @InjectRepository(OrderProductEntity)
    private readonly orderProductRepository: Repository<OrderProductEntity>,
  ) {}

  async createOrderProduct(
    product_id: number,
    order_id: number,
    price: number,
    amount: number,
  ): Promise<OrderProductEntity> {
    const newOrderProduct = this.orderProductRepository.create({
      amount,
      order_id,
      price,
      product_id,
    });

    await this.orderProductRepository.insert(newOrderProduct);

    return newOrderProduct;
  }

  async findAmountOfProductsByOrderId(
    order_id: number[],
  ): Promise<ReturnGroupOrderDto[]> {
    return this.orderProductRepository
      .createQueryBuilder('order_product')
      .select('order_product.order_id, COUNT(*) as total')
      .where('order_product.order_id IN (:...ids)', { ids: order_id })
      .groupBy('order_product.order_id')
      .getRawMany();
  }
}
