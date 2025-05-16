import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/errors/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
// import { winstonConfig } from './common/logger/winston.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: WinstonModule.createLogger(winstonConfig),
  });

  // Add this early in your bootstrap
  app.getHttpAdapter().get('/favicon.ico', (req, res) => {
    res.status(204).end();
  });

  const configService = app.get(ConfigService);

  // Security

  // Use helmet for security
  app.use(helmet());
  // Enable CORS
  app.enableCors({
    origin: true, // Allow all origins
    credentials: true, // Allow credentials
  });

  // Use cookie-parser middleware
  app.use(cookieParser());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip out unwanted properties
      forbidNonWhitelisted: true, // Throw errors for non-whitelisted properties
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Set the global prefix
  app.setGlobalPrefix('employee_organogram/api/v1');

  // Global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger (Dev only)
  if (configService.get('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('employee_organogram API')
      .addBearerAuth()
      .build();
    SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));
  }

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Employee Organogram API')
    .setDescription('API for employee hierarchy management')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addCookieAuth('refreshToken')
    .addTag('Department', 'Department for managing and their related information.')

    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  // Root endpoint
  app.getHttpAdapter().get('/', (req, res) => {
    res.send('employee_organogram server');
  });

  // Enable shutdown hooks
  app.enableShutdownHooks();

  // Start the application
  const port = configService.get<number>('PORT', 5000);
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger UI is running on: http://localhost:${port}/api-doc`);
}
bootstrap();