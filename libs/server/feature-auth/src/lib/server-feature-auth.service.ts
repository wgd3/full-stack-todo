import { ServerFeatureUserService } from '@fst/server/feature-user';
import {
  IAccessTokenPayload,
  IPublicUserData,
  ITokenResponse,
} from '@fst/shared/domain';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ServerFeatureAuthService {
  private readonly logger = new Logger(ServerFeatureAuthService.name);

  constructor(
    @Inject(forwardRef(() => ServerFeatureUserService))
    private userService: ServerFeatureUserService,
    private jwtService: JwtService
  ) {}

  async validateUser(
    email: string,
    password: string
  ): Promise<IPublicUserData | null> {
    const user = await this.userService.getOneByEmail(email);
    if (await bcrypt.compare(password, user.password)) {
      this.logger.debug(`User '${email}' authenticated successfully`);
      const { password, ...publicUserData } = user;
      return publicUserData;
    }
    return null;
  }

  async generateAccessToken(user: IPublicUserData): Promise<ITokenResponse> {
    const payload: IAccessTokenPayload = {
      email: user.email,
      sub: user.id,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
