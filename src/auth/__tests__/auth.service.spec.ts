import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../user/user.service';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { jwtMock } from '../__mocks__/jwt.mock';
import { loginPayloadMock } from '../__mocks__/loginPayload.mock';
import { returnLoginDtoMock } from '../__mocks__/returnLoginDto.mock';
import { NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findUserByEmail: jest.fn().mockResolvedValue(userEntityMock),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: () => jwtMock,
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  it('should return a user if password and email are valid', async () => {
    const user = await service.login(loginPayloadMock);

    expect(user).toEqual(returnLoginDtoMock);
  });

  it('should return an error if password is invalid', async () => {
    jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(undefined);

    const user = service.login({
      email: loginPayloadMock.email,
      password: '1234',
    });

    expect(user).rejects.toThrow(NotFoundException);
  });

  it('should return an error if email is invalid', async () => {
    jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(undefined);

    const user = service.login({
      email: 'jhon.doe@mail.com',
      password: loginPayloadMock.password,
    });

    expect(user).rejects.toThrow(NotFoundException);
  });

  it('should return an error if something went wrong in UserService', async () => {
    jest.spyOn(userService, 'findUserByEmail').mockRejectedValue(new Error());

    const user = service.login({
      email: 'jhon.doe@mail.com',
      password: loginPayloadMock.password,
    });

    expect(user).rejects.toThrow();
  });
});
