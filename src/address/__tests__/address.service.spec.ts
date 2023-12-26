import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AddressService } from '../address.service';
import { AddressEntity } from '../entities/address.entity';
import { addressMock } from '../__mocks__/address.mock';
import { UserService } from '../../user/user.service';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { CityService } from '../../city/city.service';
import { cityMock } from '../../city/__mocks__/city.mock';
import { createAddressMock } from '../__mocks__/createAddressDto.mock';

describe('AddressService', () => {
  let service: AddressService;
  let addressRepository: Repository<AddressEntity>;
  let userService: UserService;
  let cityService: CityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: getRepositoryToken(AddressEntity),
          useValue: {
            create: jest.fn().mockResolvedValue(addressMock),
            find: jest.fn().mockResolvedValue([addressMock]),
            insert: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: UserService,
          useValue: {
            findUserById: jest.fn().mockResolvedValue(userEntityMock),
          },
        },
        {
          provide: CityService,
          useValue: {
            findCityById: jest.fn().mockResolvedValue(cityMock),
          },
        },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
    userService = module.get<UserService>(UserService);
    cityService = module.get<CityService>(CityService);
    addressRepository = module.get<Repository<AddressEntity>>(
      getRepositoryToken(AddressEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(addressRepository).toBeDefined();
  });

  describe('createAddress', () => {
    it('should return an address after save', async () => {
      const address = await service.createAddress(
        createAddressMock,
        userEntityMock.id,
      );

      expect(address).toEqual(addressMock);
    });

    it('should throw an error if the user does not exist', async () => {
      jest
        .spyOn(userService, 'findUserById')
        .mockRejectedValueOnce(new Error());

      const address = service.createAddress(
        createAddressMock,
        userEntityMock.id,
      );

      expect(address).rejects.toThrow();
    });

    it('should throw an error if the city does not exist', async () => {
      jest
        .spyOn(cityService, 'findCityById')
        .mockRejectedValueOnce(new Error());

      const address = service.createAddress(
        createAddressMock,
        userEntityMock.id,
      );

      expect(address).rejects.toThrow();
    });
  });

  describe('findAddressByUserId', () => {
    it('should return all addresses to user', async () => {
      const addresses = await service.findAddressByUserId(userEntityMock.id);

      expect(addresses).toEqual([addressMock]);
    });

    it('should return not found if user has no addresses registered', async () => {
      jest.spyOn(addressRepository, 'find').mockResolvedValue(undefined);

      const addresses = service.findAddressByUserId(userEntityMock.id);

      expect(addresses).rejects.toThrow();
    });
  });
});
