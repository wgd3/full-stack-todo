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

  async validate(
    payload: Pick<IAccessTokenPayload, 'sub'> &
      Record<string, string | number | boolean | object>
  ) {
    const { sub, ...rest } = payload;
    return { userId: sub, ...rest };
  }
}
