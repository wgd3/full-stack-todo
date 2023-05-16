import { LoginRequestDto, LoginResponseDto } from '@fst/server/data-access';
import { SkipAuth } from '@fst/server/util';
import { ITokenResponse } from '@fst/shared/domain';
import { Body, Controller, HttpCode, Logger, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ServerFeatureAuthService } from './server-feature-auth.service';

@Controller({ path: 'auth/email', version: '1' })
@ApiTags('Authentication')
export class ServerFeatureAuthController {
  private logger = new Logger(ServerFeatureAuthController.name);

  constructor(private serverFeatureAuthService: ServerFeatureAuthService) {}

  @Post('login')
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  @HttpCode(200)
  @SkipAuth()
  async login(@Body() dto: LoginRequestDto): Promise<ITokenResponse> {
    this.logger.debug(`Attempting to log in user ${dto.email}`);
    return await this.serverFeatureAuthService.validateUser(dto);
  }
}
