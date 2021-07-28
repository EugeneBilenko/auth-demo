import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailToken } from './email-token.entity';
import { EmailTokenService } from './email-token.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmailToken])],
  exports: [EmailTokenService],
  providers: [EmailTokenService],
})
export class AuthModule {}
