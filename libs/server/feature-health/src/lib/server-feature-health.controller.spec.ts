import { LoggerService } from '@nestjs/common';
import {
  HealthCheckService,
  TerminusModule,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { HealthCheckExecutor } from '@nestjs/terminus/dist/health-check/health-check-executor.service';
import { TERMINUS_LOGGER } from '@nestjs/terminus/dist/health-check/logger/logger.provider';
import { Test } from '@nestjs/testing';
import { ServerFeatureHealthController } from './server-feature-health.controller';

const loggerMock: Partial<LoggerService> = {
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

const healthCheckExecutorMock: Partial<HealthCheckExecutor> = {
  execute: jest.fn(),
};

describe('ServerFeatureHealthController', () => {
  let controller: ServerFeatureHealthController;
  let healthCheck: HealthCheckService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [TerminusModule],
      providers: [
        HealthCheckExecutor,
        TypeOrmHealthIndicator,
        {
          provide: HealthCheckExecutor,
          useValue: healthCheckExecutorMock,
        },
        {
          provide: TERMINUS_LOGGER,
          useValue: loggerMock,
        },
      ],
      controllers: [ServerFeatureHealthController],
    }).compile();

    controller = module.get(ServerFeatureHealthController);
    healthCheck = module.get(HealthCheckService);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });

  it('should return a healthy state', () => {
    jest.spyOn(healthCheck, 'check').mockReturnValue(
      new Promise((res) =>
        res({
          status: 'ok',
          details: {},
        })
      )
    );
    expect(controller.healthcheck()).toBeTruthy();
  });
});
