import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { userEntityMock } from '../__mocks__/user.mock';
import { createUserMock } from '../__mocks__/createUser.mock';

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
            save: jest.fn().mockResolvedValue(userEntityMock),
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

  it('should return user in findByEmail', async () => {
    const user = await service.findUserByEmail(userEntityMock.email);
    expect(user).toEqual(userEntityMock);
  });

  it('should return an erro in findByEmail if user not found', async () => {
    jest.spyOn(userRepository, 'findOne').mockReturnValue(undefined);

    expect(service.findUserByEmail(userEntityMock.email)).rejects.toThrow();
  });

  it('should return user in findUserById', async () => {
    const user = await service.findUserById(userEntityMock.id);
    expect(user).toEqual(userEntityMock);
  });

  it('should return an erro in findUserById if user not found', async () => {
    jest.spyOn(userRepository, 'findOne').mockReturnValue(undefined);

    expect(service.findUserById(userEntityMock.id)).rejects.toThrow();
  });

  it('should return user in getUserByIdUsingRelations', async () => {
    const user = await service.getUserByIdUsingRelations(userEntityMock.id);
    expect(user).toEqual(userEntityMock);
  });

  it('should return user in getAllUsers', async () => {
    const user = await service.getAllUsers();
    expect(user).toEqual([userEntityMock]);
  });

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
