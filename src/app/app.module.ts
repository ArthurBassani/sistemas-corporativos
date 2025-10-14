import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppDataSource } from "../database/data-source";
import { AppService } from "./app.service";

@Module({
  imports: [TypeOrmModule.forRoot(AppDataSource.options)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
