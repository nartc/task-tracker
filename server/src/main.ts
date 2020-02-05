import { HttpStatus, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { IConfiguration } from './common/configuration/configuration';
import { CONFIG } from './common/configuration/configuration.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { queues } from './common/queues/queues';

const Arena = require('bull-arena');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = app.get<IConfiguration>(CONFIG);
  const logger = new Logger('NestApplication');

  logger.debug(`Environment: ${config.app.env}`);

  app.use(compression());
  app.use(helmet());

  const arena = Arena(
    {
      queues: queues.map(q => ({
        name: q.name,
        prefix: q.options.prefix,
        hostId: q.name,
        redis: { host: config.redis.host, port: config.redis.port },
        type: 'bull',
      })),
    },
    config.arena,
  );

  app.use('/arena', arena);
  logger.debug(`Arena Dashboard enabled ${config.app.domain}/arena`);

  const options = new DocumentBuilder()
    .setTitle('Task Tracker API')
    .setDescription('API Documentation for Task Tracker')
    .setVersion('1.0.0')
    .addServer(`${config.app.domain}/api/`, 'Development API')
    .addBearerAuth({ type: 'apiKey', in: 'header', name: 'Authorization' })
    .build();

  const swaggerDoc = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, swaggerDoc, {
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  });
  logger.debug(`Swagger Docs enabled: ${config.app.domain}/docs`);

  app.use('/robots.txt', (_, res) => {
    res.send('User-Agent: *\n' + 'Disallow: /');
  });
  app.use('/favicon.ico', (_, res) => {
    res.sendStatus(HttpStatus.NO_CONTENT).end();
  });

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(config.app.port, () => {
    logger.debug(`Listening at ${config.app.domain}/api`);
  });
}

bootstrap();
