import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER, // generated ethereal user
    pass: process.env.MAIL_PASS, // generated ethereal password
  },
});

export async function sendResetPassword(email: string, token: string) {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_SENDER_ADDRESS, // sender address
      to: email, // list of receivers
      subject: 'Reset password', // Subject line
      text: `Your token: ${token}`, // plain text body
    });
  } catch (e) {
    console.error(`Something wrong with Send email configuration`);
    console.error(e);
  }
}
