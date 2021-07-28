import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'login', description: 'login' })
  @IsNotEmpty()
  readonly username;

  @ApiProperty({ example: 'password', description: 'password' })
  @IsNotEmpty()
  readonly password;
}
