import { Injectable } from '@nestjs/common';
import { User } from '../../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailToken } from './email-token.entity';
import { sendResetPassword } from '../../utils/mailer';

@Injectable()
export class EmailTokenService {
  constructor(
    @InjectRepository(EmailToken)
    private readonly emailTokenRepository: Repository<EmailToken>,
  ) {}

  async create(user: User): Promise<EmailToken> {
    const token = new EmailToken();
    token.user = user;
    await token.save();

    return token;
  }

  async sendToken(email: string, token: string) {
    return sendResetPassword(email, token);
  }

  async find(token: string): Promise<EmailToken> {
    return this.emailTokenRepository.findOne({
      where: { token },
      relations: ['user'],
    });
  }

  async delete(user: User): Promise<void> {
    await this.emailTokenRepository.delete({ user });
  }
}
