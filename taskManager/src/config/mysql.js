const mysql = require('mysql2/promise');

const dotenv = require('dotenv');
dotenv.config();

const {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PW,
  MYSQL_DB,
  MYSQL_PORT,
} = process.env;

module.exports = mysql.createPool({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PW,
  database: MYSQL_DB,
  port: MYSQL_PORT,
  connectTimeout: 5000,
  connectionLimit: 10 //default 10
})