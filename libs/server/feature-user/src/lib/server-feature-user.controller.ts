import { Controller } from '@nestjs/common';
import { ServerFeatureUserService } from './server-feature-user.service';

@Controller('server-feature-user')
export class ServerFeatureUserController {
  constructor(private serverFeatureUserService: ServerFeatureUserService) {}
}
