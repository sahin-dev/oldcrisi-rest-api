import { registerAs } from '@nestjs/config';

const jwtConfig = () => {
  return {
    jwt_secret: process.env.JWT_SECRET || 'defaultSecretKey',
    jwt_token_issuer: process.env.JWT_TOKEN_ISSUER || 'yourapp',
    jwt_token_audience: process.env.JWT_TOKEN_AUDIENCE || 'yourapp',
    jwt_token_ttl: process.env.JWT_TOKEN_TTL || '3600s',
  };
};

export default registerAs('jwt', jwtConfig);
