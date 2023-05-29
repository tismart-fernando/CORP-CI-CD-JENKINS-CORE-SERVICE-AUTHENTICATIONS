import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { RequestLoginDto, ResponseLoginDto } from '../dto';
import {
  Securities,
  SecuritiesDocument,
  Users,
  UsersDocument,
} from '../../../schemas';
import { CryptoService } from '../../../common/crypto/crypto.service';
import { ResponseGenericDto } from '../../../dto';
import {
  GenerateTokenInternalException,
  InvalidCredentialsCustomException,
  RegisterSecurityInternalException,
} from '../../../exception';

@Injectable()
export class FnLoginService {
  private logger = new Logger(`::${FnLoginService.name}::`);

  constructor(
    @InjectModel(Users.name)
    private readonly userModel: mongoose.Model<UsersDocument>,
    @InjectModel(Securities.name)
    private readonly securityModel: mongoose.Model<SecuritiesDocument>,
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
  ) {}

  async execute(requestLoginDto: RequestLoginDto): Promise<ResponseGenericDto> {
    this.logger.debug(
      `::execute::parameters::${JSON.stringify(requestLoginDto)}`,
    );
    const { email, password } = requestLoginDto;
    const findUserByEmailPassword: UsersDocument =
      await this.findUserByEmailPassword(email, password);
    const generateTokenForUser = await this.generateTokenForUser(
      findUserByEmailPassword._id,
      findUserByEmailPassword.email,
    );
    await this.registerSecurityForUser(
      findUserByEmailPassword._id,
      generateTokenForUser.tokenDecrypt,
    );
    return <ResponseGenericDto>{
      message: 'Processo exitoso',
      operation: `::${FnLoginService.name}::execute`,
      data: <ResponseLoginDto>{
        token: generateTokenForUser.tokenEncrypt,
      },
    };
  }

  private async findUserByEmailPassword(email: string, password: string) {
    const userByEmailPassword = await this.userModel.findOne({
      email,
      password,
    });
    if (!userByEmailPassword)
      throw new InvalidCredentialsCustomException(`findUserByEmailPassword`);

    this.logger.debug(
      `::execute::findUserByEmailPassword::${userByEmailPassword.email}`,
    );
    return userByEmailPassword;
  }

  private async generateTokenForUser(idUser: string, email: string) {
    try {
      const token = await this.jwtService.signAsync({ idUser, email });
      const encrypt = await this.cryptoService.encrypt(token);
      return {
        tokenEncrypt: encrypt,
        tokenDecrypt: token,
      };
    } catch (error) {
      this.logger.error(error);
      throw new GenerateTokenInternalException();
    }
  }

  private async registerSecurityForUser(
    idUser: mongoose.Types.ObjectId,
    token: string,
  ) {
    try {
      const findSecurityByIdUser = await this.securityModel.findOne({ idUser });
      if (!findSecurityByIdUser) {
        await this.securityModel.create({ idUser, tokens: [token] });
      } else {
        await this.securityModel.updateOne(
          { idUser },
          { $addToSet: { tokens: token } },
        );
      }
    } catch (error) {
      this.logger.error(error);
      throw new RegisterSecurityInternalException();
    }
  }
}