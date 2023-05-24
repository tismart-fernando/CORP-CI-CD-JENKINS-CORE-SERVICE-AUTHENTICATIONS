import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import {
  FnKeysService,
  FnLoginService,
  FnLogoutService,
  FnResetPasswordService,
} from './services';
import { ResponseGenericDto } from '../../dto';
import { ThrottlerGuard } from '@nestjs/throttler';

const responseFnKeysService = <ResponseGenericDto>{
  message: 'Processo exitoso',
  operation: `::${FnKeysService.name}::execute`,
  data: {},
};

const responseFnLoginService = <ResponseGenericDto>{
  message: 'Processo exitoso',
  operation: `::${FnLoginService.name}::execute`,
  data: {},
};

const responseFnLogoutService = <ResponseGenericDto>{
  message: 'Processo exitoso',
  operation: `::${FnLogoutService.name}::execute`,
  data: {},
};

const responseFnResetPasswordService = <ResponseGenericDto>{
  message: 'Processo exitoso',
  operation: `::${FnResetPasswordService.name}::execute`,
  data: {},
};

describe('AuthController', () => {
  let authController: AuthController;
  let fnKeysService: FnKeysService;
  let fnLoginService: FnLoginService;
  let fnLogoutService: FnLogoutService;
  let fnResetPasswordService: FnResetPasswordService;

  const mockThrottlerGuard: any = {
    CanActivate: jest.fn().mockResolvedValue(() => true),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: FnKeysService,
          useFactory: () => ({
            execute: jest.fn(async () => responseFnKeysService),
          }),
        },
        {
          provide: FnLoginService,
          useFactory: () => ({
            execute: jest.fn(async () => responseFnLoginService),
          }),
        },
        {
          provide: FnLogoutService,
          useFactory: () => ({
            execute: jest.fn(async () => responseFnLogoutService),
          }),
        },
        {
          provide: FnResetPasswordService,
          useFactory: () => ({
            execute: jest.fn(async () => responseFnResetPasswordService),
          }),
        },
      ],
    })
      .overrideGuard(ThrottlerGuard)
      .useValue(mockThrottlerGuard)
      .compile();

    authController = module.get<AuthController>(AuthController);
    fnKeysService = module.get<FnKeysService>(FnKeysService);
    fnLoginService = module.get<FnLoginService>(FnLoginService);
    fnLogoutService = module.get<FnLogoutService>(FnLogoutService);
    fnResetPasswordService = module.get<FnResetPasswordService>(
      FnResetPasswordService,
    );
  });

  describe('keys', () => {
    it('should return an sucessfully keys service', async () => {
      await expect(authController.keys()).resolves.toEqual(
        responseFnKeysService,
      );
    });
  });

  describe('login', () => {
    it('should return an sucessfully login service', async () => {
      await expect(authController.login(null)).resolves.toEqual(
        responseFnLoginService,
      );
    });
  });

  describe('logout', () => {
    it('should return an sucessfully logout service', async () => {
      await expect(authController.logOut(null)).resolves.toEqual(
        responseFnLogoutService,
      );
    });
  });

  describe('reset-password', () => {
    it('should return an sucessfully reset-password service', async () => {
      await expect(authController.resetPassword(null)).resolves.toEqual(
        responseFnResetPasswordService,
      );
    });
  });
});
