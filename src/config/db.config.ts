import { registerAs } from '@nestjs/config';

export const dbConfig = () => ({
  type: process.env.DB_TYPE || 'mongodb',
  url: process.env.DB_URI || 'mongodb://localhost:27017/oldcrisis',
});

export default registerAs('db', dbConfig);
