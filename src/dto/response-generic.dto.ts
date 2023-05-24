import { ApiProperty } from '@nestjs/swagger';
import {
  ResponseKeysDto,
  ResponseLoginDto,
  ResponseLogoutDto,
  ResponseResetPasswordDto,
} from 'src/modules/auth/dto';

export class ResponseGenericDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  operation: string;

  @ApiProperty()
  data:
    | ResponseKeysDto
    | ResponseLoginDto
    | ResponseLogoutDto
    | ResponseResetPasswordDto;
}
