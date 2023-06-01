import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as mongoose from 'mongoose';
import {
  Users,
  UsersDocument,
  Securities,
  SecuritiesDocument,
} from '../../../schemas';
import { ResponseGenericDto } from '../../../dto';
import { CryptoService } from '../../../common/crypto/crypto.service';
import { FnLoginService } from './fn-login.service';
import { RequestLoginDto } from '../dto';
import { InvalidCredentialsCustomException } from '../../../exception';

const responseFnLoginService = <ResponseGenericDto>{
  message: 'Processo exitoso',
  operation: `::${FnLoginService.name}::execute`,
  data: {
    token: undefined,
  },
};

const requestLoginDto: RequestLoginDto = {
  email: 'fernando.zavaleta@tismart.com',
  password: 'facil123',
};

describe('FnLoginService Test suite', () => {
  let fnLoginService: FnLoginService;
  let securitiesModel: mongoose.Model<SecuritiesDocument>;
  let usersModel: mongoose.Model<UsersDocument>;
  let jwtService: JwtService;
  let cryptoService: CryptoService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FnLoginService,
        {
          provide: getModelToken(Users.name),
          useValue: {
            findOne: jest.fn().mockImplementation((email, password) => ({
              email,
              password,
            })),
          },
        },
        {
          provide: getModelToken(Securities.name),
          useValue: {
            findOne: jest.fn().mockImplementation((idUser) => ({
              idUser,
            })),
            create: jest.fn(),
            updateOne: jest.fn(),
          },
        },
        { provide: JwtService, useValue: { signAsync: jest.fn() } },
        { provide: CryptoService, useValue: { encrypt: jest.fn() } },
      ],
    }).compile();

    fnLoginService = module.get<FnLoginService>(FnLoginService);
    securitiesModel = module.get(getModelToken(Securities.name));
    usersModel = module.get(getModelToken(Users.name));
  });

  describe('execute', () => {
    it('sucessfully process', async () => {
      expect(await fnLoginService.execute(requestLoginDto)).toStrictEqual(
        responseFnLoginService,
      );
    });

    it('failed InvalidCredentialsCustomException', async () => {
      jest.spyOn(usersModel, 'findOne').mockImplementation(() => {
        return null;
      });

      expect(
        await fnLoginService.execute({
          email: 'emailfailedtoexecuteprocess',
          password: 'passwordfailedtoexecuteprocess',
        }),
      ).rejects.toThrowError();
    });
  });
});
