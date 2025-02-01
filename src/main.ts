import { environment } from './environment/environment';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { AppModule } from './app.module';

async function server() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //============= Swagger Config =====================
  const swagConfig = environment.swagger;
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(swagConfig.title)
    .setDescription(swagConfig.description)
    .setVersion(swagConfig.version)
    .addTag(swagConfig.tag)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swagConfig.swaggerEndpoint, app, document);
  //============= Swagger Config =====================

  app.enableCors(); // Enable cors-origin

  await app.listen(environment.port);

  //============= HBS Config =====================
  // app.useStaticAssets(join(__dirname, '..', 'public'));
  // app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // app.setViewEngine('hbs');
  //============= HBS Config =====================

  // app.setGlobalPrefix('api/v1', {
  //   exclude: ['/', 'any-endpoint'],
  // }); //make all routes with /api/v1
}
server();
