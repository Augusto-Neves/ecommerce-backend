import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { userEntityMock } from '../__mocks__/user.mock';
import { UserEntity } from '../entities/user.entity';
import { createUserMock } from '../__mocks__/createUser.mock';
import { returnUserDtoMock } from '../__mocks__/returnUserDto.mock';
import { returnUpdateMock } from '../../__mocks__/returnUpdate.mock';
import { updatePasswordMock } from '../__mocks__/updatePassword.mock';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([userEntityMock]),
            findOne: jest.fn().mockResolvedValue(userEntityMock),
            save: jest.fn().mockResolvedValue(userEntityMock),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should return a new user when createUser is called', async () => {
    jest.spyOn(service, 'createUser').mockResolvedValue(userEntityMock);

    const user = await controller.createUser(createUserMock);
    expect(user).toEqual(returnUserDtoMock);
  });

  it('should return all users when getAllUsers is called', async () => {
    jest.spyOn(service, 'getAllUsers').mockResolvedValue([userEntityMock]);

    const allUsers = await controller.getAllUsers();

    expect(allUsers).toEqual([returnUserDtoMock]);
  });

  it('should return a user when getUserByUserId is called', async () => {
    jest
      .spyOn(service, 'getUserByIdUsingRelations')
      .mockResolvedValue(userEntityMock);

    const user = await controller.getUserByUserId(userEntityMock.id);
    expect(user).toEqual(returnUserDtoMock);
  });

  it('should update user password', async () => {
    jest
      .spyOn(service, 'updateUserPassword')
      .mockResolvedValue(returnUpdateMock);

    const updateUserPassword = await controller.updateUserPassword(
      userEntityMock.id,
      updatePasswordMock,
    );

    expect(updateUserPassword).toEqual(returnUpdateMock);
  });
});
