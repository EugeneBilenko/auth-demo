import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RefreshPasswordDto } from './dto/refresh-password.dto';
import { ConfirmTokenDto } from './dto/confirm-token.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @Post('register')
  registration(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @ApiOperation({ summary: 'Registration' })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Body() loginDto: LoginDto, @Request() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Reset password' })
  @Post('reset-password')
  async resetPassword(@Body() refreshPasswordDto: RefreshPasswordDto) {
    await this.authService.refreshPassword(refreshPasswordDto);
    return {
      message: `Token successfully sent to ${refreshPasswordDto.email}`,
    };
  }

  @ApiOperation({ summary: 'Reset password' })
  @Post('confirm')
  async confirmToken(@Body() confirmTokenDto: ConfirmTokenDto) {
    const result = await this.authService.confirmToken(confirmTokenDto);
    if (result) {
      return { message: 'Password successfully updated' };
    }
  }
}
