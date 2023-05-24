import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import {
  RequestLoginDto,
  RequestLogoutDto,
  RequestResetPasswordDto,
  ResponseLogoutDto,
  ResponseResetPasswordDto,
} from './dto';
import {
  FnLoginService,
  FnLogoutService,
  FnResetPasswordService,
} from './services';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ResponseGenericDto } from '../../dto';
import { FnKeysService } from './services/fn-keys.service';
import {
  GenerateTokenInternalException,
  InvalidCredentialsCustomException,
} from '../../exception';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly fnLoginService: FnLoginService,
    private readonly fnLogoutService: FnLogoutService,
    private readonly fnResetPasswordService: FnResetPasswordService,
    private readonly fnKeysService: FnKeysService,
  ) {}

  @UseGuards(ThrottlerGuard)
  @Throttle()
  @Get('/v1.0/keys')
  @ApiCreatedResponse({
    description: 'The keys has been successfully created authentication.',
    type: ResponseGenericDto,
  })
  @ApiConflictResponse({
    description: 'The keys has been failed by conflict authentication',
  })
  @ApiInternalServerErrorResponse({
    description: 'The keys has been failed by created authentication.',
  })
  keys(): Promise<ResponseGenericDto> {
    return this.fnKeysService.execute();
  }

  @UseGuards(ThrottlerGuard)
  @Throttle()
  @Post('/v1.0/login')
  @ApiCreatedResponse({
    description: 'The login has been successfully created authentication.',
    type: ResponseGenericDto,
  })
  @ApiConflictResponse({
    description: 'The login has been failed by conflict authentication',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Exception.',
    type: GenerateTokenInternalException,
  })
  @ApiConflictResponse({
    description: 'Conflict Exception',
    type: InvalidCredentialsCustomException,
  })
  login(@Body() requestLodinDto: RequestLoginDto): Promise<ResponseGenericDto> {
    return this.fnLoginService.execute(requestLodinDto);
  }

  @Post('/v1.0/logout')
  logOut(
    @Body() requestLogoutDto: RequestLogoutDto,
  ): Promise<ResponseLogoutDto> {
    return this.fnLogoutService.execute(requestLogoutDto);
  }

  @Post('/v1.0/reset-password')
  resetPassword(
    @Body() requestResetPasswordDto: RequestResetPasswordDto,
  ): Promise<ResponseResetPasswordDto> {
    return this.fnResetPasswordService.execute(requestResetPasswordDto);
  }
}
