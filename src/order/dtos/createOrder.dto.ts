import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  address_id: number;

  @IsOptional()
  @IsNumber()
  amount_payments?: number;

  @IsOptional()
  @IsString()
  code_pix?: string;

  @IsOptional()
  @IsString()
  date_payment?: string;
}
