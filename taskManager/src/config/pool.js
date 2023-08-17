const sql = require('mssql');
const { config } = require('./config');

const pool = new sql.ConnectionPool(config.dbconfig)
  .connect()
  .then((pool) => {
    console.log('DB연결 성공');
    return pool;
  })
  .catch((err) => {
    console.log('err ', err);
  });
 

module.exports = {
  sql,
  pool
}