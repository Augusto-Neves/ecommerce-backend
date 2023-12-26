import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  image: string;

  @IsNumber()
  category_id: number;

  @IsNumber()
  price: number;
}
