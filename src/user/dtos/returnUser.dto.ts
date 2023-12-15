import { UserEntity } from '../entities/user.entity';
import { ReturnAddressDto } from '../../address/dto/returnAddress.dto';

export class ReturnUserDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  addresses?: ReturnAddressDto[];

  constructor(userEntity: UserEntity) {
    const firstNumber = userEntity.cpf.charAt(0);
    const lastNumbers = userEntity.cpf.slice(-2);
    const asterisk = '*'.repeat(userEntity.cpf.length - 3);

    this.id = userEntity.id;
    this.name = userEntity.name;
    this.email = userEntity.email;
    this.phone = userEntity.phone;
    this.cpf = firstNumber + asterisk + lastNumbers;
    this.addresses = userEntity.addresses
      ? userEntity.addresses.map((address) => new ReturnAddressDto(address))
      : undefined;
  }
}
