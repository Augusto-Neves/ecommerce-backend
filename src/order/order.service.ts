import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dtos/createOrder.dto';
import { PaymentService } from '../payment/payment.service';
import { PaymentEntity } from '../payment/entities/payment.entity';
import { CartService } from '../cart/cart.service';
import { OrderProductService } from '../order-product/order-product.service';
import { ProductService } from '../product/product.service';
import { OrderProductEntity } from '../order-product/entities/order-product.entity';
import { CartEntity } from '../cart/entities/cart.entity';
import { ProductEntity } from '../product/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly paymentService: PaymentService,
    private readonly cartService: CartService,
    private readonly orderProductService: OrderProductService,
    private readonly productService: ProductService,
  ) {}

  async saveOrder(
    createOrderDto: CreateOrderDto,
    user_id: number,
    payment: PaymentEntity,
  ): Promise<OrderEntity> {
    const newOrder = this.orderRepository.create({
      address_id: createOrderDto.address_id,
      date: createOrderDto.date_payment,
      payment_id: payment.id,
      user_id,
    });

    await this.orderRepository.insert(newOrder);

    return newOrder;
  }

  async createOrderProductUsingCart(
    cart: CartEntity,
    order_id: number,
    products: ProductEntity[],
  ): Promise<OrderProductEntity[]> {
    return Promise.all(
      cart.cart_product?.map((cartProduct) =>
        this.orderProductService.createOrderProduct(
          cartProduct.product_id,
          order_id,
          products.find((product) => product.id === cartProduct.product_id)
            ?.price || 0,
          cartProduct.amount,
        ),
      ),
    );
  }

  async createOrder(
    createOrderDto: CreateOrderDto,
    user_id: number,
  ): Promise<OrderEntity> {
    const cart = await this.cartService.findCartByUserId(user_id, true);

    const products = await this.productService.getAllProducts(
      cart.cart_product?.map((cart_product) => cart_product.product_id),
    );

    const payment: PaymentEntity = await this.paymentService.createPayment(
      createOrderDto,
      products,
      cart,
    );

    const order = await this.saveOrder(createOrderDto, user_id, payment);

    await this.createOrderProductUsingCart(cart, order.id, products);

    await this.cartService.clearCart(user_id);

    return order;
  }

  async findOrdersByUserId(user_id: number): Promise<OrderEntity[]> {
    const orders = await this.orderRepository.find({
      where: {
        user_id,
      },
      relations: {
        address: true,
        orders_product: {
          product: true,
        },
        payment: {
          payment_status: true,
        },
      },
    });

    if (!orders || orders.length === 0) {
      throw new NotFoundException('Orders not found');
    }

    return orders;
  }
}
