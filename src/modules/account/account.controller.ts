import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { RequestRegisterDto } from './dto';
import { FnRegisterService } from './services';
import { ResponseGenericDto } from '../../dto';

@Controller('account')
export class AccountController {
  constructor(private readonly fnRegisterService: FnRegisterService) {}

  @Post('v1.0/register')
  @ApiCreatedResponse({
    description: 'The register has been successfully created account.',
    type: ResponseGenericDto,
  })
  @ApiConflictResponse({
    description: 'The register has been failed by conflict account',
  })
  @ApiInternalServerErrorResponse({
    description: 'The register has been failed by created account.',
  })
  register(
    @Body() requestRegisterDto: RequestRegisterDto,
  ): Promise<ResponseGenericDto> {
    return this.fnRegisterService.execute(requestRegisterDto);
  }
}
