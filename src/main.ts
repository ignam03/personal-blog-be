import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CORS } from './constants';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from './modules/auth/guards/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'verbose', 'debug', 'log'],
  });

  //app.useLogger(app.get(MyLogger));

  const configService = app.get(ConfigService);

  const port = configService.get('PORT');

  const config = new DocumentBuilder()
    .setTitle('Personal Blog API')
    .setDescription('Personal Blog API')
    .setVersion('0.1')
    .addTag('blog')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors(CORS);

  app.setGlobalPrefix('api');

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AuthGuard(reflector));

  await app.listen(port);
  console.log(`Application is running on http://localhost:${port}`);
}
bootstrap();
