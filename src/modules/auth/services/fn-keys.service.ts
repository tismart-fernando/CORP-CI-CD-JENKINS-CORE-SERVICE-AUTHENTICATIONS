import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as crypto from 'crypto';
import { Keys, KeysDocument } from '../../../schemas';
import { ResponseGenericDto } from '../../../dto';
import { GENERAL } from '../../../const/general.const';
import { AuditPropertiesSchema } from '../../../common/schemas/audit-properties.schema';
import {
  GenerateHashKeysInternalException,
  RegisterHashInternalException,
} from '../../../exception';
import { ResponseKeysDto } from '../dto';

@Injectable()
export class FnKeysService {
  private logger = new Logger(`::${FnKeysService.name}::`);

  constructor(
    @InjectModel(Keys.name)
    private readonly keysModel: mongoose.Model<KeysDocument>,
  ) {}

  async execute(): Promise<ResponseGenericDto> {
    this.logger.debug(`::execute::parameters::`);
    const { requestHash, credentialKeyBase64, passwordKeyBase64 } =
      await this.generateHashAndKeys();
    const hash: any = await this.registerHash(
      requestHash,
      credentialKeyBase64,
      passwordKeyBase64,
    );
    return <ResponseGenericDto>{
      message: GENERAL.MESSAGE_SUCCEFULL,
      operation: `::${FnKeysService.name}::execute`,
      data: <ResponseKeysDto>{
        keys: hash.keys,
        hash: hash.requestHash,
      },
    };
  }

  private async generateHashAndKeys() {
    try {
      const requestHash: any = crypto
        .createHash('md5')
        .update(crypto.randomBytes(16))
        .digest('hex');

      const credentialsKey: any = crypto.randomBytes(32);
      const passwordKey: any = crypto.randomBytes(32);

      const credentialKeyBase64: any = credentialsKey.toString('base64');
      const passwordKeyBase64: any = passwordKey.toString('base64');

      return {
        requestHash,
        credentialKeyBase64,
        passwordKeyBase64,
      };
    } catch (error) {
      this.logger.error(error);
      throw new GenerateHashKeysInternalException();
    }
  }

  private async registerHash(
    requestHash: string,
    credentialKeyBase64: string,
    passwordKeyBase64: string,
  ) {
    try {
      const hash: any = await this.keysModel.create({
        requestHash: requestHash,
        keys: {
          x1: credentialKeyBase64,
          x2: passwordKeyBase64,
        },
        auditProperties: <AuditPropertiesSchema>{
          dateUpdate: null,
          dateCreate: new Date(),
          recordActive: true,
          status: {
            code: 1,
            description: GENERAL.STATUS_CREATED,
          },
          userUpdate: null,
          userCreate: `${FnKeysService.name}`,
        },
      });

      return hash;
    } catch (error) {
      this.logger.error(error);
      throw new RegisterHashInternalException();
    }
  }
}
