import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { User } from '../../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailToken } from './email-token.entity';

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

  async sendToken(email, token) {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER, // generated ethereal user
        pass: process.env.MAIL_PASS, // generated ethereal password
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: process.env.MAIL_SENDER_ADDRESS, // sender address
      to: email, // list of receivers
      subject: 'Reset password', // Subject line
      text: `Your token: ${token}`, // plain text body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }

  async find(token): Promise<EmailToken> {
    return this.emailTokenRepository.findOne({
      where: { token },
      relations: ['user'],
    });
  }

  async delete(user): Promise<void> {
    await this.emailTokenRepository.delete({ user });
  }
}
