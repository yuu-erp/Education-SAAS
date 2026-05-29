import { AllConfigType } from '@/config';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableShutdownHooks();

  const configService = app.get<ConfigService<AllConfigType>>(ConfigService);

  app.use(helmet());

  app.enableCors({
    origin: configService.get('app.frontendDomain', { infer: true }),
    credentials: true,
  });

  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', {
      infer: true,
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,

      forbidNonWhitelisted: true,

      transform: true,

      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Education SAAS API')
    .setDescription('The Education SAAS API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  const port = configService.getOrThrow('app.port', {
    infer: true,
  });

  await app.listen(port);

  const logger = new Logger('Bootstrap');

  logger.log(`Application running on: http://localhost:${port}`);
}

void bootstrap();
