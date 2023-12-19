import { RolesGuard } from '../role.guard';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext } from '@nestjs/common';
import { LoginPayloadDto } from '../../auth/dto/loginPayload.dto';
import { UserType } from '../../user/enum/user-types.enum';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;
  let jwtService: JwtService;

  beforeEach(() => {
    reflector = new Reflector();
    jwtService = new JwtService({ secret: process.env.JWT_SECRET });
    rolesGuard = new RolesGuard(reflector, jwtService);
  });

  it('should be defined', () => {
    expect(rolesGuard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should allow access if no roles are required', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      const context: ExecutionContext = {
        getClass: jest.fn(),
        getHandler: jest.fn(),
        switchToHttps: jest.fn(() => ({
          getRequest: jest.fn().mockReturnValue({
            headers: {},
          }),
        })),
      } as unknown as ExecutionContext;

      const result = await rolesGuard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow access if user has the required role', async () => {
      const requiredRoles: UserType[] = [UserType.Admin];
      const context: ExecutionContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {
              authorization: 'validToken',
            },
          }),
        }),
      } as unknown as ExecutionContext;

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({
        type_user: UserType.Admin,
      } as LoginPayloadDto);

      const result = await rolesGuard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should deny access if user does not have the required role', async () => {
      const requiredRoles: UserType[] = [UserType.Admin];
      const context: ExecutionContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {
              authorization: 'validToken',
            },
          }),
        }),
      } as unknown as ExecutionContext;

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({
        type_user: UserType.User,
      } as LoginPayloadDto);

      const result = await rolesGuard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should deny access if JWT verification fails', async () => {
      const requiredRoles: UserType[] = [UserType.Admin];
      const context: ExecutionContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            headers: {
              authorization: 'invalidToken',
            },
          }),
        }),
      } as unknown as ExecutionContext;

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);

      jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error());

      const result = await rolesGuard.canActivate(context);

      expect(result).toBe(false);
    });
  });
});
