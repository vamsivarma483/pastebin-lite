import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

let app: any;

async function bootstrap() {
  app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }));
  
  // Enable CORS for all origins in development/vercel
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT ?? 3001;
  
  // Only listen if running as standalone (not as serverless)
  if (require.main === module) {
    await app.listen(port, '0.0.0.0');
    console.log(`Server running on port ${port}`);
  }
  
  return app;
}

// For local development
if (require.main === module) {
  bootstrap().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

// For Vercel serverless
export default bootstrap();


