import pkg from 'pg';
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

// const connection = new Pool({
//   // host: 'localhost',
//   // port: 5432,
//   // user: 'postgres',
//   // password: process.env.PASSWORD,
//   // database: 'tastecamp'

// });
export const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
});