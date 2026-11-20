import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Every URL starts with /api/v1 (API versioning from Lab 05)
  app.setGlobalPrefix('api/v1');

  // Input validation for every request body and query string
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove fields that are not in the DTO
      forbidNonWhitelisted: true, // 400 if unknown fields are sent
      transform: true, // convert "1" -> 1 for numbers
    }),
  );

  // Same error JSON format everywhere
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Smart Factory API running on http://localhost:${port}/api/v1`);
}
void bootstrap();
