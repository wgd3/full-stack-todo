import { registerAs } from '@nestjs/config';
import { CONFIG_HOST, CONFIG_PORT } from '../constants';

export const appConfig = registerAs('app', () => ({
  host: process.env[CONFIG_HOST],
  port: process.env[CONFIG_PORT],
}));
