import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmTokenDto {
  @ApiProperty({ example: 'token', description: 'token' })
  @IsNotEmpty()
  @IsString()
  readonly token;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(16)
  @ApiProperty({ example: 'password', description: 'password' })
  readonly password: string;
}
