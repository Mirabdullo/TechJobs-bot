import { Sequelize } from 'sequelize'
import * as dotenv from 'dotenv'
dotenv.config()

export const sequelize = new Sequelize(
  String(process.env.DB_NAME),
  String(process.env.DB_USER),
  String(process.env.DB_PASSWORD),
  {
    dialect: 'postgres',
    logging: false,
    host: String(process.env.DB_HOST),
    port: Number(process.env.DB_PORT),
  },
)
