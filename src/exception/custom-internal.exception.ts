import { InternalServerErrorException } from '@nestjs/common';
import { GENERAL } from '../const/general.const';

export class GenerateTokenInternalException extends InternalServerErrorException {
  constructor() {
    super(`${GENERAL.EXCEPTION_CODE.GENERATE_TOKEN}`);
  }
}

export class GenerateHashKeysInternalException extends InternalServerErrorException {
  constructor() {
    super(`${GENERAL.EXCEPTION_CODE.GENERATE_HASH_KEY}`);
  }
}

export class RegisterSecurityInternalException extends InternalServerErrorException {
  constructor() {
    super(`${GENERAL.EXCEPTION_CODE.REGISTER_SECURITY}`);
  }
}

export class RegisterHashInternalException extends InternalServerErrorException {
  constructor() {
    super(`${GENERAL.EXCEPTION_CODE.REGISTER_HASH_KEY}`);
  }
}

export class FindSecurityTokenException extends InternalServerErrorException {
  constructor() {
    super(`${GENERAL.EXCEPTION_CODE.FIND_SECURITY_TOKEN}`);
  }
}

export class DeleteTokenInSecurityException extends InternalServerErrorException {
  constructor() {
    super(`${GENERAL.EXCEPTION_CODE.DELETE_SECURITY_TOKEN}`);
  }
}

export class RegisterAccountException extends InternalServerErrorException {
  constructor() {
    super(`${GENERAL.EXCEPTION_CODE.REGISTER_ACCOUNT}`);
  }
}
