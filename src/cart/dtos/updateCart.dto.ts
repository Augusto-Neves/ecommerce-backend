import { IsNumber } from 'class-validator';

export class UpdateCartDto {
  @IsNumber()
  product_id: number;

  @IsNumber()
  amount: number;
}
