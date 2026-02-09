import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }));
  
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 3001;
  
  if (require.main === module) {
    await app.listen(port, '0.0.0.0');
    console.log(`Server running on port ${port}`);
  }
  
  return app;
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default bootstrap;


