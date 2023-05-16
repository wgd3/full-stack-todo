import { IApiErrorResponse, ISocialUserData } from '@fst/shared/domain';
import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MD5 } from 'crypto-js';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class ServerFeatureAuthGoogleService {
  private logger = new Logger(ServerFeatureAuthGoogleService.name);
  private google: OAuth2Client;
  constructor(private configService: ConfigService) {
    this.google = new OAuth2Client(
      configService.get(`google.clientId`),
      configService.get(`google.clientSecret`)
    );
  }

  async getProfile(payload: { idToken: string }): Promise<ISocialUserData> {
    this.logger.debug(`Getting login ticket..`);
    const loginTicket = await this.google.verifyIdToken({
      idToken: payload.idToken,
      audience: [this.configService.getOrThrow(`google.clientId`)],
    });

    const userData = loginTicket.getPayload();
    // this.logger.debug(`Got user data from Google ID token`);
    // this.logger.debug(JSON.stringify(userData, null, 2));
    if (!userData) {
      throw new UnprocessableEntityException({
        error: `token problem`,
        message: `Error processing ID token`,
      } as IApiErrorResponse);
    }

    if (!userData.picture && userData.email) {
      // fallback to gravatars
      const hashedEmail = MD5(userData.email).toString();
      userData.picture = `https://www.gravatar.com/avatar/${hashedEmail}`;
    }

    return {
      id: userData.sub,
      email: userData.email ?? '',
      givenName: userData.given_name ?? null,
      familyName: userData.family_name ?? null,
      profilePicture: userData.picture ?? null,
    };
  }
}
