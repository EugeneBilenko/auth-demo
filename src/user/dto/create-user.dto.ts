import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'testUser', description: 'username' })
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(16)
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(16)
  @ApiProperty({ example: 'password', description: 'password' })
  readonly password: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'test@example.com', description: 'email' })
  readonly email: string;
}
