import { DataSource } from "typeorm";

import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, // JAMAIS use true em produção!
  logging: ["query", "error"],
  entities: [__dirname + "/../**/*.entity.{ts,js}"], // Garanta que este caminho está correto
  migrations: [__dirname + "/migrations/*.{ts,js}"],
  subscribers: [],
});
