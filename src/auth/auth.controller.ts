import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RefreshPasswordDto } from './dto/refresh-password.dto';
import { ConfirmTokenDto } from './dto/confirm-token.dto';
import { LoginDto } from './dto/login.dto';
import { MessageResponse, TokenResponse } from './types';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Registration' })
  @Post('register')
  registration(@Body() createUserDto: CreateUserDto): Promise<TokenResponse> {
    return this.authService.register(createUserDto);
  }

  @ApiOperation({ summary: 'Login' })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Body() loginDto: LoginDto, @Request() req): Promise<TokenResponse> {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Reset password' })
  @Post('reset-password')
  async resetPassword(
    @Body() refreshPasswordDto: RefreshPasswordDto,
  ): Promise<MessageResponse> {
    await this.authService.refreshPassword(refreshPasswordDto);
    return {
      message: `Token successfully sent to ${refreshPasswordDto.email}`,
    };
  }

  @ApiOperation({ summary: 'Reset password confirmation' })
  @Post('confirm')
  async confirmToken(
    @Body() confirmTokenDto: ConfirmTokenDto,
  ): Promise<MessageResponse> {
    const result = await this.authService.confirmToken(confirmTokenDto);
    if (result) {
      return { message: 'Password successfully updated' };
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh token' })
  @Get('refresh-token')
  refreshToken(@Request() req) {
    const token = req.headers.authorization;
    if (!token) {
      throw new UnauthorizedException();
    }

    return this.authService.refreshToken(token);
  }
}
