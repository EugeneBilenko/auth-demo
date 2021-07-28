import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshPasswordDto {
  @ApiProperty({ example: 'text@example.com', description: 'email' })
  @IsNotEmpty()
  @IsEmail()
  readonly email;
}
