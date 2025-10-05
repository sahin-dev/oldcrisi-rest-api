import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConsoleLogger, Global, RequestMethod, ValidationPipe } from '@nestjs/common';
import { GlobalHttpExceptionFilter } from './common/filters/httpException.filter';
import { ResponseTransformerInterceptor } from './common/interceptors/responseTransformer.interceptor';
import { join } from 'path';
import { GlobalExceptionFilter } from './common/filters/GlobalException.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new ConsoleLogger(),
  });
 
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {prefix:"/uploads"})

  app.setGlobalPrefix('api/v1', {
    exclude:[{path:"/", method:RequestMethod.GET}, {path:'/providers', method:RequestMethod.GET}]
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalHttpExceptionFilter())


  const reflector = app.get(Reflector)

  app.useGlobalInterceptors(new ResponseTransformerInterceptor(reflector))

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
