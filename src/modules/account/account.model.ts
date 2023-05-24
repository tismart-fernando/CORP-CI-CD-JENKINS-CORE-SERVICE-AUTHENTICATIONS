import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { FnRegisterService } from './services';
import { MongooseModule } from '@nestjs/mongoose';
import { Profiles, ProfilesSchema, Users, UsersSchema } from 'src/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UsersSchema,
      },
      {
        name: Profiles.name,
        schema: ProfilesSchema,
      },
    ]),
  ],
  controllers: [AccountController],
  providers: [FnRegisterService],
})
export class AccountModule {}
