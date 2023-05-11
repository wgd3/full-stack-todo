/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { CONFIG_PORT } from '@fst/server/util';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  const configService = app.get(ConfigService);
  const port = configService.get(CONFIG_PORT);
  Logger.log(`Listening on port ${port}`);

  // set up versioning
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  // TODO - revisit and secure this!
  app.enableCors({
    origin: '*',
  });
  Logger.log(`Enabled all origins for CORS`);

  // handle swagger
  const config = new DocumentBuilder()
    .setTitle(`Full Stack To-Do REST API`)
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, document, {
    jsonDocumentUrl: 'api/v1/swagger.json',
  });
  Logger.log(`Swagger initialized`);

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}/v1`
  );
}

bootstrap();
