import { ConflictException } from '@nestjs/common';

export class InvalidCredentialsCustomException extends ConflictException {
  constructor(originException: string) {
    super(`correo y/o contraseña incorrectos [${originException}]`);
  }
}

export class InvalidTokenCustomException extends ConflictException {
  constructor(tokenException: string, idUserException: string) {
    super(
      `token ingresado es incorrecto [token:${tokenException} idUser:${idUserException}]`,
    );
  }
}

export class InvalidEmailDniCustomException extends ConflictException {
  constructor(emailException: string, dniException: string) {
    super(
      `usuario existente, intente registrar otro [email:${emailException} dni:${dniException}]`,
    );
  }
}

export class InvalidHaveMostAgeCustomException extends ConflictException {
  constructor() {
    super(`debe seleccionar la opcion de mayoria de edad`);
  }
}
