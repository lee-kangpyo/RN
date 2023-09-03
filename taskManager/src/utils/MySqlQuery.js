const mysql = require('../config/mysql');

function runQuery(sql, params) {
  return new Promise( async (resolve, reject) => {
    let conn = null;
    
    try {
      conn = await mysql.getConnection();
      await conn.beginTransaction(); //트랜잭션 시작
      
      let value;

      if(params){
        const [ result ] = await conn.query(sql, params);
        value = result;
      }else{
        const [ result ] = await conn.query(sql);
        value = result;
      }
      
      await conn.commit(); //커밋
      resolve(value);
    } catch (err) {
      if (conn !== null) {
        await conn.rollback(); //롤백
      } 
      reject(err);
    } finally {
      if (conn !== null) {
        conn.release();
      }
    }
  })  
}

module.exports = runQuery;