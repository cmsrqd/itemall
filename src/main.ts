import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResultInterceptor } from './common/interceptor/ResultInterceptor';
import { AllExceptionsFilter } from './common/filter/ExceptionFilter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = new DocumentBuilder()
    .setTitle('itemall项目接口文档')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 跨域
  app.enableCors();
  // 静态文件
  app.useStaticAssets('upload');

  // 全局拦截器 => 处理成功操作
  app.useGlobalInterceptors(new ResultInterceptor());
  // 全局异常过滤器 => 失败操作，或者异常问题
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3000);
}
bootstrap();
