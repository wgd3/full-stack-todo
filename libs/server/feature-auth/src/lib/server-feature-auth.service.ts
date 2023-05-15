import { ServerFeatureUserService } from '@fst/server/feature-user';
import {
  IAccessTokenPayload,
  IApiErrorResponse,
  ILoginPayload,
  ISocialUserData,
  ITokenResponse,
  IUser,
  SocialProviderEnum,
} from '@fst/shared/domain';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnprocessableEntityException,
  forwardRef,
} from '@nestjs/common';
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

  async validateUser({
    email,
    password,
  }: ILoginPayload): Promise<ITokenResponse> {
    const user = await this.userService.getOneByEmailOrFail(email);
    if (user.socialProvider !== 'email') {
      throw new BadRequestException({
        message: `User registered via a social platform, please use that instead`,
      } as IApiErrorResponse);
    }

    // we've detected if the user registered via email, which requires a password
    const validPassword = await bcrypt.compare(
      user.password as string,
      password
    );
    if (!validPassword) {
      throw new BadRequestException({
        message: `Email or password is incorrect, try again`,
      } as IApiErrorResponse);
    }

    // user was found and has the right password, return a token
    const { id, todos, ...payload } = user;
    return await this.generateAccessToken({ ...payload, sub: id });
  }

  async validateSocialUser(
    provider: SocialProviderEnum,
    data: ISocialUserData
  ): Promise<ITokenResponse> {
    let user: IUser | null;
    let userByEmail: IUser | null = null;

    /** If an email was provided, see if they're already registered with that email */
    if (data.email) {
      userByEmail = await this.userService.getOne({
        where: { email: data.email },
      });
    }

    user = await this.userService.getOne({
      where: {
        socialId: data.id,
        socialProvider: provider,
      },
    });

    if (user) {
      // user has already registered, see if email needs to be updated
      if (data.email && !userByEmail) {
        user.email = data.email;
        await this.userService.updateUser(data.id, { email: data.email });
      }
    } else if (userByEmail) {
      // user was not found by socialId, but has registered with
      // this email already
      user = userByEmail;
    } else {
      // create new user!
      user = await this.userService.create({
        email: data.email ?? null,
        familyName: data.familyName ?? null,
        givenName: data.givenName ?? null,
        socialId: data.id,
        socialProvider: provider,
        password: null,
        profilePicture: data.profilePicture ?? null,
      });

      // get the new object from the database after creation
      user = await this.userService.getOneOrFail(user.id);
    }

    // if the user hasn't been found/created at this point,
    // something is very wrong
    if (!user) {
      throw new UnprocessableEntityException({
        message: `Unknown error occurred while handling user`,
        error: `user not found`,
      } as IApiErrorResponse);
    }

    const tokenPayload: IAccessTokenPayload = {
      sub: user.id,
      email: user.email,
      givenName: user.givenName,
      familyName: user.familyName,
      profilePicture: user.profilePicture,
    };
    return await this.generateAccessToken(tokenPayload);
  }

  async generateAccessToken(
    payload: IAccessTokenPayload
  ): Promise<ITokenResponse> {
    // const payload: IAccessTokenPayload = {
    //   email: user.email,
    //   sub: user.id,
    // };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
