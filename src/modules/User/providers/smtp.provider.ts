import { Inject, Injectable } from '@nestjs/common';
import { SmsProvider } from './sms.provider';
import nodemailer, { Transporter } from 'nodemailer';
import { type ConfigType } from '@nestjs/config';
import mailerConfig from 'src/config/mailer.config';

@Injectable()
export class SmtpProvider extends SmsProvider {
  private transporter: Transporter | undefined = undefined;

  constructor(
    @Inject(mailerConfig.KEY)
    mailerConfiguration: ConfigType<typeof mailerConfig>,
  ) {
    super();
    this.transporter = nodemailer.createTransport({
      host: mailerConfiguration.host,
      port: mailerConfiguration.port,
      secure: false,
      auth: {
        user: mailerConfiguration.user,
        pass: mailerConfiguration.pass,
      },
    });
  }

  async sendmail(to: string, subject: string, body: string): Promise<void> {
    if (!this.transporter) {
      throw new Error('smtp transporter does not initialized');
    }

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM || '"No Reply" <no-reply@example.com>',
      to,
      subject,
      html: body,
    });
  }
}
