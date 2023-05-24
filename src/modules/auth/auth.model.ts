import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { FnLoginService } from './services/fn-login.service';
import { FnLogoutService } from './services/fn-logout.service';
import { FnResetPasswordService } from './services/fn-reset-password.service';
import {
  Keys,
  KeysSchema,
  Securities,
  SecuritiesSchema,
  Users,
  UsersSchema,
} from 'src/schemas';
import { CryptoModule } from 'src/common/crypto/crypto.module';
import { KEYS } from 'src/const/keys.const';
import { FnKeysService } from './services/fn-keys.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UsersSchema,
      },
      {
        name: Securities.name,
        schema: SecuritiesSchema,
      },
      {
        name: Keys.name,
        schema: KeysSchema,
      },
    ]),
    JwtModule.register({
      global: true,
      secret: KEYS.jwt_secret,
      signOptions: { expiresIn: '60s' },
    }),
    CryptoModule,
  ],
  controllers: [AuthController],
  providers: [
    FnLoginService,
    FnLogoutService,
    FnResetPasswordService,
    FnKeysService,
  ],
})
export class AuthModule {}
