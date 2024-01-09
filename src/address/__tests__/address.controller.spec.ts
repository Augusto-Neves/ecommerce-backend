import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from '../address.service';
import { addressMock } from '../__mocks__/address.mock';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { createAddressMock } from '../__mocks__/createAddressDto.mock';
import { AddressController } from '../address.controller';
import { ReturnAddressDto } from '../dto/returnAddress.dto';

describe('AddressModule', () => {
  let controller: AddressController;
  let service: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [
        {
          provide: AddressService,
          useValue: {
            createAddress: jest.fn().mockResolvedValue(addressMock),
            findAddressByUserId: jest.fn().mockResolvedValue([addressMock]),
          },
        },
      ],
    }).compile();

    controller = module.get<AddressController>(AddressController);
    service = module.get<AddressService>(AddressService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should return an address', async () => {
    jest.spyOn(service, 'createAddress').mockResolvedValue(addressMock);

    const address = await controller.createAddress(
      createAddressMock,
      userEntityMock.id,
    );

    expect(address).toEqual(addressMock);
  });

  it('should return all addresses from user id', async () => {
    const addresses = await controller.findAddressByUserId(userEntityMock.id);

    expect(addresses).toEqual([new ReturnAddressDto(addressMock)]);
  });
});
