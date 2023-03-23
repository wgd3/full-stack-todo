import { LoginRequestDto, LoginResponseDto } from '@fst/server/data-access';
import { SkipAuth } from '@fst/server/util';
import { ITokenResponse } from '@fst/shared/domain';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ServerFeatureAuthService } from './server-feature-auth.service';

@Controller({ path: 'auth', version: '1' })
@ApiTags('Authentication')
export class ServerFeatureAuthController {
  constructor(private serverFeatureAuthService: ServerFeatureAuthService) {}

  @Post('login')
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @HttpCode(200)
  @SkipAuth()
  async login(
    @Body() { email, password }: LoginRequestDto
  ): Promise<ITokenResponse> {
    const user = await this.serverFeatureAuthService.validateUser(
      email,
      password
    );
    if (!user) {
      throw new BadRequestException(`Email or password is invalid`);
    }
    return await this.serverFeatureAuthService.generateAccessToken(user);
  }
}
