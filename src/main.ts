import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ClassSerializerInterceptor } from "@nestjs/common";
import { AppModule } from "./app/app.module";
import { NestFactory } from "@nestjs/core";
import { Reflector } from "@nestjs/core";
import helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  const config = new DocumentBuilder()
    .setTitle("Users Service")
    .setVersion("1.0")
    .addTag("users")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);
  app.setGlobalPrefix("v1");
  await app.listen(process.env.PORT || 3001);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
}

bootstrap();
