import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ServerFeatureAuthGoogleService } from './server-feature-auth-google.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ServerFeatureAuthService } from '@fst/server/feature-auth';
import { SkipAuth } from '@fst/server/util';
import { ITokenResponse, SocialProviderEnum } from '@fst/shared/domain';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@Controller({ path: 'auth/google', version: '1' })
@ApiTags('Authentication')
export class ServerFeatureAuthGoogleController {
  constructor(
    private serverFeatureAuthGoogleService: ServerFeatureAuthGoogleService,
    private serverFeatureAuthService: ServerFeatureAuthService
  ) {}

  @Post('login')
  @ApiBody({
    description: 'Payload from google auth',
  })
  @SkipAuth()
  async login(@Body() payload: { idToken: string }): Promise<ITokenResponse> {
    Logger.debug(`Attempting to log in user from Google OAuth`);
    const data = await this.serverFeatureAuthGoogleService.getProfile({
      idToken: payload.idToken,
    });
    return this.serverFeatureAuthService.validateSocialUser(
      SocialProviderEnum.google,
      data
    );
  }
}
