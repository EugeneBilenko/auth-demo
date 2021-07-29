import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { Repository, UpdateResult } from 'typeorm';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { RefreshPasswordDto } from './dto/refresh-password.dto';
import { EmailTokenService } from './email-token/email-token.service';
import { ConfirmTokenDto } from './dto/confirm-token.dto';
import { RefreshToken } from '../user/entities/refresh-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenResponse } from './types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailTokenService: EmailTokenService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.userService.findOne({ username }, true);
    if (user && (await compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    return this.generateToken(user);
  }

  async register(createUserDto: CreateUserDto) {
    const isAlreadyExist = !!(await this.userService.checkIfExists(
      { email: createUserDto.email },
      { username: createUserDto.email },
    ));
    if (isAlreadyExist) {
      throw new BadRequestException(
        'User with this username or email already exists',
      );
    }
    const user = await this.userService.create(createUserDto);

    return this.generateToken(user);
  }

  async refreshToken(token: string): Promise<TokenResponse> {
    const refreshToken = token.split(' ').pop();
    const userToken = await this.findByToken(refreshToken);
    if (!userToken) {
      throw new UnauthorizedException();
    }

    return this.generateToken(userToken.user);
  }

  private async updateOrCreateRefreshToken(user: User, token): Promise<void> {
    let refreshToken = await this.refreshTokenRepository.findOne({
      where: { user },
    });

    if (!refreshToken) {
      refreshToken = new RefreshToken({ user });
    }

    refreshToken.token = token;
    refreshToken.save();
  }

  private async generateToken(user: User): Promise<TokenResponse> {
    const payload = { username: user.username, sub: user.id };
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '1 s',
    });
    this.updateOrCreateRefreshToken(user, refreshToken);

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken,
    };
  }

  async refreshPassword(
    refreshPasswordDto: RefreshPasswordDto,
  ): Promise<string> {
    const user = await this.userService.findOne({
      email: refreshPasswordDto.email,
    });
    if (!user) {
      throw new BadRequestException('User with this email not found');
    }
    await this.emailTokenService.delete(user);
    const token = await this.emailTokenService.create(user);
    await this.emailTokenService.sendToken(user.email, token.token);

    return token.token;
  }

  async confirmToken(confirmTokenDto: ConfirmTokenDto): Promise<UpdateResult> {
    const token = await this.emailTokenService.find(confirmTokenDto.token);
    if (!token) {
      throw new BadRequestException('Incorrect token');
    }
    return this.userService.updatePassword(
      token.user.id,
      confirmTokenDto.password,
    );
  }

  async findByToken(token: string): Promise<RefreshToken> {
    return this.refreshTokenRepository.findOne(
      { token },
      { relations: ['user'] },
    );
  }
}
