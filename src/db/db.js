const { Pool } = require("pg");
require("dotenv").config();

if (
  !process.env.POSTGRES_USER ||
  !process.env.POSTGRES_HOST ||
  !process.env.POSTGRES_DB ||
  !process.env.POSTGRES_PASSWORD ||
  !process.env.POSTGRES_PORT
)
  process.exit(1);

console.log(
  process.env.POSTGRES_USER,
  process.env.POSTGRES_HOST,
  process.env.POSTGRES_DB,
  process.env.POSTGRES_PASSWORD,
  process.env.POSTGRES_PORT
);

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

module.exports = pool;
