import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS for frontend requests
  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
  console.log('NestJS backend running on http://0.0.0.0:3001 (accessible on local Wi-Fi)');
}
bootstrap();

