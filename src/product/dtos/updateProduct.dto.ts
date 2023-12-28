import { IsNumber, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsNumber()
  category_id: number;

  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  image: string;
}
