import { SkipAuth } from '@fst/server/util';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { DATABASE_HEALTHCHECK_KEY } from './constants';

@ApiTags('health')
@Controller({ path: 'health' })
export class ServerFeatureHealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  @SkipAuth()
  healthcheck() {
    return this.health.check([
      () => this.db.pingCheck(DATABASE_HEALTHCHECK_KEY),
    ]);
  }
}
