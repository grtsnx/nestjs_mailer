import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './utils/globalErrorHandler';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  app.enableCors({
    origin: [`http://localhost:${port}`, `https://os.bringbills.com`],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: 'GET,PATCH,POST,PUT,DELETE',
  });
  app.use(express.json({ limit: 250 << 20 }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      whitelist: true,
    }),
  );

  const swaggerOptions = new DocumentBuilder()
    .setTitle('BringBills OS')
    .setDescription(
      'API reference for working with BringBills OS version 1.0.0',
    )
    .setVersion('1.0.0')
    .addServer('https://os.bringbills.com', 'Production')
    .addServer(`http://localhost:${port}`, 'Local environment')
    .addBearerAuth(
      { type: 'http', scheme: 'Bearer', bearerFormat: 'JWT' },
      'Authorization',
    )
    .addTag('Server', 'Endpoint for Server functions')
    .addTag('Authentication', 'Endpoint for Auth functions')
    .addTag('Users', 'Endpoint for Users functions')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('docs', app, swaggerDocument);

  //await app.listen(3000);

  try {
    await app.listen(port);
    console.log(`http://localhost:${port}`);
  } catch (err) {
    console.error(err.message);
  }
}
bootstrap();
