import { registerAs } from '@nestjs/config';
import {
  CONFIG_DATABASE_HOST,
  CONFIG_DATABASE_LOGGING_ENABLED,
  CONFIG_DATABASE_NAME,
  CONFIG_DATABASE_PASSWORD,
  CONFIG_DATABASE_PATH,
  CONFIG_DATABASE_PORT,
  CONFIG_DATABASE_SYNCHRONIZE,
  CONFIG_DATABASE_TYPE,
  CONFIG_DATABASE_USERNAME,
} from '../constants';

export const dbConfig = registerAs('db', () => ({
  type: process.env[CONFIG_DATABASE_TYPE],
  host: process.env[CONFIG_DATABASE_HOST],
  port: process.env[CONFIG_DATABASE_PORT],
  password: process.env[CONFIG_DATABASE_PASSWORD],
  name: process.env[CONFIG_DATABASE_NAME],
  path: process.env[CONFIG_DATABASE_PATH],
  username: process.env[CONFIG_DATABASE_USERNAME],
  synchronize: process.env[CONFIG_DATABASE_SYNCHRONIZE] === 'true',
  logging: process.env[CONFIG_DATABASE_LOGGING_ENABLED],
}));
