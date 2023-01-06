import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as session from 'express-session';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['https://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: '*',
  });
  app.use(
    session({
      name:"SESSION_ID",
      secret: 'my-secret',
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 600000,
      },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('NESTJS EXAMPLE')
    .setDescription('The nest API description')
    .setVersion('1.0')
    .addTag('nest')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(PORT);
}
bootstrap();
