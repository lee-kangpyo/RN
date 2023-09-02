const mysql = require('../config/mysql');

function runQuery(sql, params) {
  return new Promise( async (resolve, reject) => {
    let conn = null;
    try {
      conn = await mysql.getConnection();
      await conn.beginTransaction(); //트랜잭션 시작
      const [ result ] = await conn.query(sql, params);
      await conn.commit(); //커밋
      resolve(result);
    } catch (err) {
      if (conn !== null) {
        await conn.rollback(); //롤백
      } 
      reject(err);
    } finally {
      conn.release();
    }
  })  
}

module.exports = runQuery;