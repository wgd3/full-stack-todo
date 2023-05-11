import { ServerFeatureUserService } from '@fst/server/feature-user';
import {
  IAccessTokenPayload,
  IPublicUserData,
  ITokenResponse,
  IUser,
} from '@fst/shared/domain';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
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
    // console.dir(user);
    if (user && (await bcrypt.compare(password, user.password))) {
      this.logger.debug(`User '${email}' authenticated successfully`);
      console.log(`User '${email}' authenticated successfully`);
      const { password, ...publicUserData } = user;
      return publicUserData;
    }
    return null;
  }

  async validateGoogleUser(data: IAccessTokenPayload): Promise<ITokenResponse> {
    let user: IUser;

    const userByEmail = await this.userService.getOneByEmail(data.email);

    if (userByEmail) {
      user = userByEmail;
    } else {
      user = await this.userService.create({
        email: data.email,
        password: 'Password1!',
      });
      user = await this.userService.getOne(user.id);
    }

    const token = await this.jwtService.signAsync(data);
    return { access_token: token };
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
