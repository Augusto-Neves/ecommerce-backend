import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { userEntityMock } from '../__mocks__/user.mock';
import { createUserMock } from '../__mocks__/createUser.mock';
import {
  updatePasswordInvalidMock,
  updatePasswordMock,
} from '../__mocks__/updatePassword.mock';
import { returnUpdateMock } from '../../__mocks__/returnUpdate.mock';
import { validatePassword } from '../../utils/validate-password';
import { BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([userEntityMock]),
            findOne: jest.fn().mockResolvedValue(userEntityMock),
            create: jest.fn().mockResolvedValue(userEntityMock),
            insert: jest.fn().mockResolvedValue({}),
            update: jest.fn().mockResolvedValue(returnUpdateMock),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should return user in findByEmail', async () => {
      const user = await service.findUserByEmail(userEntityMock.email);
      expect(user).toEqual(userEntityMock);
    });

    it('should return an erro in findByEmail if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockReturnValue(undefined);

      expect(service.findUserByEmail(userEntityMock.email)).rejects.toThrow();
    });
  });

  describe('findUserById', () => {
    it('should return user in findUserById', async () => {
      const user = await service.findUserById(userEntityMock.id);
      expect(user).toEqual(userEntityMock);
    });

    it('should return an erro in findUserById if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockReturnValue(undefined);

      expect(service.findUserById(userEntityMock.id)).rejects.toThrow();
    });
  });

  describe('getUserByIdUsingRelations', () => {
    it('should return user in getUserByIdUsingRelations', async () => {
      const user = await service.getUserByIdUsingRelations(userEntityMock.id);
      expect(user).toEqual(userEntityMock);
    });
  });

  describe('getAllUsers', () => {
    it('should return user in getAllUsers', async () => {
      const user = await service.getAllUsers();
      expect(user).toEqual([userEntityMock]);
    });
  });

  describe('createUser', () => {
    it('should return an error in create if email already exits', async () => {
      const user = service.createUser(createUserMock);
      expect(user).rejects.toThrow();
    });

    it('should return user if user not exits in createUser', async () => {
      jest.spyOn(userRepository, 'findOne').mockReturnValue(undefined);

      const user = await service.createUser(createUserMock);
      expect(user).toEqual(userEntityMock);
    });
  });

  describe('updateUserPassword', () => {
    it('should return an error if user does not exists on database', async () => {
      jest.spyOn(userRepository, 'findOne').mockReturnValue(undefined);

      const updateUserPassword = service.updateUserPassword(
        updatePasswordMock,
        userEntityMock.id,
      );

      expect(updateUserPassword).rejects.toThrow();
    });

    it('should update user password', async () => {
      const updateUserPassword = await service.updateUserPassword(
        updatePasswordMock,
        userEntityMock.id,
      );

      expect(updateUserPassword).toEqual(returnUpdateMock);
    });

    it('should return an error if given password is different from user password', async () => {
      jest.fn(validatePassword).mockResolvedValue(false);

      const updateUserPassword = service.updateUserPassword(
        updatePasswordInvalidMock,
        userEntityMock.id,
      );

      expect(updateUserPassword).rejects.toThrow(
        new BadRequestException('Last password is invalid'),
      );
    });
  });
});
