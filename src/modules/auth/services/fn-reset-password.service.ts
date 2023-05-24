import { Injectable, Logger } from '@nestjs/common';
import { RequestResetPasswordDto, ResponseResetPasswordDto } from '../dto';

@Injectable()
export class FnResetPasswordService {
  private logger = new Logger(`::${FnResetPasswordService.name}::`);

  constructor() {}

  execute(
    requestLoginDto: RequestResetPasswordDto,
  ): Promise<ResponseResetPasswordDto> {
    this.logger.debug(`::execute::parameters::${requestLoginDto}`);

    return null;
  }
}
