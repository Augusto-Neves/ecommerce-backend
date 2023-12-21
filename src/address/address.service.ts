import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressEntity } from './entities/address.entity';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/createAddress.dto';
import { UserService } from '../user/user.service';
import { CityService } from '../city/city.service';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
    private readonly userService: UserService,
    private readonly cityService: CityService,
  ) {}

  async createAddress(
    createAddressDto: CreateAddressDto,
    userId: number,
  ): Promise<AddressEntity> {
    await this.userService.findUserById(userId);
    await this.cityService.findCityById(createAddressDto.city_id);

    return this.addressRepository.save({
      ...createAddressDto,
      user_id: userId,
    });
  }

  async findAddressByUserId(userId: number): Promise<AddressEntity[]> {
    const address = await this.addressRepository.find({
      where: {
        user_id: userId,
      },
      relations: {
        city: {
          state: true,
        },
      },
    });

    if (!address || address.length === 0) {
      throw new NotFoundException(`Address not found to user_id: ${userId}`);
    }

    return address;
  }
}
