import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { database } from '../configs/database';

@Module({
  imports: [
    ConfigModule.forFeature(database),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('dbHost'),
        port: configService.get('dbPort'),
        username: configService.get('dbUser'),
        password: configService.get('dbPass'),
        database: configService.get('dbName'),
        entities: ['dist/**/*.entity.js'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
