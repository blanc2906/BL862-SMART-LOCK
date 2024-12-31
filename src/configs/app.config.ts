import { registerAs } from '@nestjs/config';

import {IsInt, IsOptional, IsUrl } from 'class-validator';

import validateConfig from 'src/shared/validator-config';

export type TAppConfig = {
  host: string;
  port: number;
};

class AppConfigValidator {
  @IsUrl()
  @IsOptional()
  HOST?: string;

  @IsInt()
  @IsOptional()
  PORT?: number;
}

export default registerAs<TAppConfig>('app', () => {
  validateConfig(process.env, AppConfigValidator);

  return {
    host: process.env.HOST || 'localhost',
    port: parseInt(process.env.PORT) || 3000,
  };
});
