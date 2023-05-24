import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {
  Profiles,
  ProfilesDocument,
  Users,
  UsersDocument,
} from '../../../schemas';
import { RequestRegisterDto } from '../dto';
import { ResponseGenericDto } from '../../../dto';
import {
  InvalidEmailDniCustomException,
  InvalidHaveMostAgeCustomException,
  RegisterAccountException,
} from '../../../exception';

@Injectable()
export class FnRegisterService {
  private logger = new Logger(`::${FnRegisterService.name}::`);

  constructor(
    @InjectModel(Users.name)
    private readonly userModel: mongoose.Model<UsersDocument>,
    @InjectModel(Profiles.name)
    private readonly profilesModel: mongoose.Model<ProfilesDocument>,
  ) {}

  async execute(
    requestRegisterDto: RequestRegisterDto,
  ): Promise<ResponseGenericDto> {
    const { email, dni, haveMostAge } = requestRegisterDto;
    this.logger.debug(
      `::execute::parameters::${JSON.stringify(requestRegisterDto)}`,
    );
    await this.validateHaveMostAge(haveMostAge);
    await this.validateEmailOrDni(email, dni);
    await this.registerAccount(requestRegisterDto);

    return <ResponseGenericDto>{
      message: 'Processo exitoso',
      operation: `::${FnRegisterService.name}::execute`,
      data: {},
    };
  }

  private async registerAccount(requestRegisterDto: RequestRegisterDto) {
    const {
      email,
      password,
      haveMostAge,
      dni,
      telephone,
      firstName,
      lastName,
    } = requestRegisterDto;

    const status = {
      code: 1,
      description: 'Activo',
    };
    try {
      const userCreate = await this.userModel.create({
        email,
        password,
        haveMostAge,
        auditProperties: {
          userCreate: email,
          status,
        },
      });

      await this.profilesModel.create({
        idUser: userCreate._id,
        firstName,
        lastName,
        dni,
        telephone,
        status,
      });
    } catch (error) {
      this.logger.error(error);
      throw new RegisterAccountException();
    }
  }

  private async validateEmailOrDni(email: string, dni: string) {
    const userByEmailOrDni = await this.userModel.findOne({
      $or: [{ email }, { dni }],
    });
    if (userByEmailOrDni) throw new InvalidEmailDniCustomException(email, dni);
  }

  private async validateHaveMostAge(haveMostAge: boolean) {
    if (!haveMostAge) throw new InvalidHaveMostAgeCustomException();
  }
}
