import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderProductEntity } from './entities/order-product.entity';

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
}
