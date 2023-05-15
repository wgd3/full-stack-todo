import { IApiErrorResponse, ISocialUserData } from '@fst/shared/domain';
import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class ServerFeatureAuthGoogleService {
  private google: OAuth2Client;
  constructor(private configService: ConfigService) {
    this.google = new OAuth2Client(
      configService.get(`google.clientId`),
      configService.get(`google.clientSecret`)
    );
  }

  async getProfile(payload: { idToken: string }): Promise<ISocialUserData> {
    Logger.debug(`Getting login ticket..`);
    const loginTicket = await this.google.verifyIdToken({
      idToken: payload.idToken,
      audience: [this.configService.getOrThrow(`google.clientId`)],
    });

    const userData = loginTicket.getPayload();

    if (!userData) {
      throw new UnprocessableEntityException({
        error: `token problem`,
        message: `Error processing ID token`,
      } as IApiErrorResponse);
    }

    return {
      id: userData.sub,
      email: userData.email ?? '',
      givenName: userData.given_name ?? null,
      familyName: userData.family_name ?? null,
    };
  }
}
