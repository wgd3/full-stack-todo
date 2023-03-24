import { SetMetadata } from '@nestjs/common';

export const SKIP_AUTH_KEY = 'skipAuth';

/**
 * Used in conjunction with the JWT Auth Guard.
 */
export const SkipAuth = () => SetMetadata(SKIP_AUTH_KEY, true);
