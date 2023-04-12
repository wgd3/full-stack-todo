import { registerAs } from '@nestjs/config';
import {
  CONFIG_GOOGLE_CLIENT_ID,
  CONFIG_GOOGLE_CLIENT_SECRET,
} from '../constants';

export const googleConfig = registerAs('google', () => ({
  clientId: process.env[CONFIG_GOOGLE_CLIENT_ID],
  clientSecret: process.env[CONFIG_GOOGLE_CLIENT_SECRET],
}));
