// 환경변수 불러오기 ----------------------------------------
const dotenv = require('dotenv');
dotenv.config();
// ---------------------------------------------------------

// config 객체 생성 후 export -------------------------------
const config = {
  port: process.env.DB_PORT,
  dbconfig: {
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT),
    pool: {
      max: 5,
      min: 1,
      idleTimeoutMillis: 30000,
    },
    options: {
      encrypt: false,
      datebase: process.env.DB_DATEBASE,
      trustServerCertificate: true,
    },
    authentication: {
      type: 'default',
      options: {
        userName: process.env.DB_USERNAME,
        password: process.env.DB_PASSOWRD,
      },
    },
  },
};

module.exports = { config };
// ---------------------------------------------------------