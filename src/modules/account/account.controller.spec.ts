import { Test } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { FnRegisterService } from './services/fn-register.service';
import { ResponseGenericDto } from 'src/dto';

const sucessfullyRegisterReturn = <ResponseGenericDto>{
  message: 'Processo exitoso',
  operation: `::${FnRegisterService.name}::execute`,
  data: {},
};

describe('AccountController', () => {
  let accountController: AccountController;
  let fnRegisterService: FnRegisterService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: FnRegisterService,
          useFactory: () => ({
            execute: jest.fn(async () => sucessfullyRegisterReturn),
          }),
        },
      ],
    }).compile();

    fnRegisterService = module.get<FnRegisterService>(FnRegisterService);
    accountController = module.get<AccountController>(AccountController);
  });

  describe('register', () => {
    it('should return an sucessfully register', async () => {
      await expect(accountController.register(null)).resolves.toEqual(
        sucessfullyRegisterReturn,
      );
    });
  });
});
