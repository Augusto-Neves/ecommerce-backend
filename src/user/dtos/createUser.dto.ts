import { IsEmail, IsPhoneNumber, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('BR')
  phone: string;

  @IsString()
  @Length(11, 11)
  cpf: string;

  @IsString()
  password: string;
}
