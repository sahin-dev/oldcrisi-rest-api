import { registerAs } from '@nestjs/config';

const mailerConfig = () => ({
  host: process.env.MAILER_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.MAILER_PORT || '587', 10),
  user: process.env.MAILER_MAIL,
  pass: process.env.MAILER_PASSWORD,
});

export default registerAs('mailer', mailerConfig);
