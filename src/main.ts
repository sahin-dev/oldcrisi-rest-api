import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConsoleLogger, Global, RequestMethod, ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/exception.filter';
import { ResponseTransformerInterceptor } from './common/interceptors/responseTransformer.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new ConsoleLogger(),
  });

  app.setGlobalPrefix('api/v1', {
    exclude:[{path:"/", method:RequestMethod.GET}]
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter())

  const reflector = app.get(Reflector)

  app.useGlobalInterceptors(new ResponseTransformerInterceptor(reflector))

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
