import { IAccessTokenPayload } from '@fst/shared/domain';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  /**
   * Simple method for converting an access token into data included in
   * a Request object.
   *
   * From https://docs.nestjs.com:
   * For the jwt-strategy, Passport first verifies the JWT's signature and
   * decodes the JSON. It then invokes our validate() method passing the
   * decoded JSON as its single parameter. Based on the way JWT signing
   * works, we're guaranteed that we're receiving a valid token that we
   * have previously signed and issued to a valid user.
   *
   * As a result of all this, our response to the validate() callback
   * is trivial: we simply return an object containing the userId and
   * username properties. Recall again that Passport will build a user
   * object based on the return value of our validate() method, and
   * attach it as a property on the Request object.
   *
   * @param payload
   * @returns
   */
  async validate(payload: IAccessTokenPayload) {
    const { sub, ...rest } = payload;
    return { userId: sub, ...rest };
  }
}
