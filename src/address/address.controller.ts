import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/createAddress.dto';
import { AddressService } from './address.service';
import { AddressEntity } from './entities/address.entity';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-types.enum';
import { UserId } from '../decorators/user-id.decorator';
import { ReturnAddressDto } from './dto/returnAddress.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Roles(UserType.User)
  @Post()
  @UsePipes(ValidationPipe)
  async createAddress(
    @Body() createAddressDto: CreateAddressDto,
    @UserId() user_id: number,
  ): Promise<AddressEntity> {
    return this.addressService.createAddress(createAddressDto, user_id);
  }

  @Roles(UserType.User, UserType.Admin)
  @Get()
  async findAddressByUserId(
    @UserId() user_id: number,
  ): Promise<ReturnAddressDto[]> {
    const addresses = await this.addressService.findAddressByUserId(user_id);

    return addresses.map((address) => new ReturnAddressDto(address));
  }
}
