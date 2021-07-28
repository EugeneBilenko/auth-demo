import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { compare } from 'bcryptjs';
import { RefreshPasswordDto } from './dto/refresh-password.dto';
import { EmailToken } from './email-token/email-token.entity';
import { EmailTokenService } from './email-token/email-token.service';
import { ConfirmTokenDto } from './dto/confirm-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailTokenService: EmailTokenService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne('username', username);
    if (user && (await compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    return this.generateToken(user);
  }

  async register(createUserDto: CreateUserDto) {
    const check = !!(await this.userService.checkBy(
      { email: createUserDto.email },
      { username: createUserDto.email },
    ));
    if (check) {
      throw new BadRequestException(
        'User with this username or email already exists',
      );
    }
    const user = await this.userService.create(createUserDto);

    return this.generateToken(user);
  }

  private generateToken(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async refreshPassword(
    refreshPasswordDto: RefreshPasswordDto,
  ): Promise<string> {
    const user = await this.userService.findOne(
      'email',
      refreshPasswordDto.email,
    );
    if (!user) {
      throw new BadRequestException('User with this email not found');
    }
    await this.emailTokenService.delete(user.id);
    const token = await this.emailTokenService.create(user);
    this.emailTokenService.sendToken(user.email, token.token);

    return token.token;
  }

  async confirmToken(confirmTokenDto: ConfirmTokenDto): Promise<any> {
    const token = await this.emailTokenService.find(confirmTokenDto.token);
    if (!token) {
      throw new BadRequestException('Incorrect token');
    }
    this.userService.updatePassword(token.user.id, confirmTokenDto.password);

    return true;
  }
}
