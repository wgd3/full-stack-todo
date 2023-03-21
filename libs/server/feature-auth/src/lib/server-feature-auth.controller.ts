import { Controller } from '@nestjs/common';
import { ServerFeatureAuthService } from './server-feature-auth.service';

@Controller('server-feature-auth')
export class ServerFeatureAuthController {
  constructor(private serverFeatureAuthService: ServerFeatureAuthService) {}
}
