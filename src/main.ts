import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { JwtExceptionFilter } from './common/filter/jwt-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true })); // Enable ValidationPipe globally
  app.useGlobalFilters(new JwtExceptionFilter());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('KYC Service APIs')
    .setDescription('Rest APIs for the KYC Service')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('http://localhost:3000/')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);

  await app.listen(3000);
}
bootstrap();
