import { IsNumber } from 'class-validator';

export class InsertCartDto {
  @IsNumber()
  product_id: number;

  @IsNumber()
  amount: number;
}
