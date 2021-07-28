import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { app } from './configs/app';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [app], isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
