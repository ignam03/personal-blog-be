import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CORS } from './constants';

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

  app.enableCors(CORS);

  app.setGlobalPrefix('api');

  await app.listen(3000);
  console.log(`Application is running on ${port}`);
}
bootstrap();
