import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { userEntityMock } from '../__mocks__/user.mock';
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
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn().mockResolvedValue(userEntityMock),
            getAllUsers: jest.fn().mockResolvedValue([userEntityMock]),
            getUserByIdUsingRelations: jest
              .fn()
              .mockResolvedValue(userEntityMock),
            updateUserPassword: jest.fn().mockResolvedValue(returnUpdateMock),
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
    const user = await controller.createUser(createUserMock);
    expect(user).toEqual(returnUserDtoMock);
  });

  it('should return all users when getAllUsers is called', async () => {
    const allUsers = await controller.getAllUsers();

    expect(allUsers).toEqual([returnUserDtoMock]);
  });

  it('should return a user when getUserByUserId is called', async () => {
    const user = await controller.getUserByUserId(userEntityMock.id);
    expect(user).toEqual(returnUserDtoMock);
  });

  it('should update user password', async () => {
    const updateUserPassword = await controller.updateUserPassword(
      userEntityMock.id,
      updatePasswordMock,
    );

    expect(updateUserPassword).toEqual(returnUpdateMock);
  });
});
