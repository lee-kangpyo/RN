//const logger = require("../logger");
const { pool } = require('../config/pool');
const sql = require('mssql');


async function execSql(query, params) {
  try {
      console.log(query + JSON.stringify(params)+ "\n\n");
      const poool = await pool;
      const request = poool.request();
      Object.entries(params).forEach(([key, value]) => {
        if (key == 'rtnValue') {
          request.output(key, ""); // 출력 매개변수 설정
        } else {
          request.input(key, value); // 다른 입력 매개변수 설정
        }

      });
      const result = await request.query(query);
      return result;
    } catch (err) {
      //logger.info(err);
      console.log(err);
    };
};

async function execSqlNoLog(query, params) {
  try {
      const poool = await pool;
      const request = poool.request();
      Object.entries(params).forEach(([key, value]) => {
        if (key == 'rtnValue') {
          request.output(key, ""); // 출력 매개변수 설정
        } else {
          request.input(key, value); // 다른 입력 매개변수 설정
        }

      });
      const result = await request.query(query);
      return result;
    } catch (err) {
      //logger.info(err);
      console.log(err);
    };
};

async function execSqlNoParams(query) {
  try {
      const poool = await pool;
      const request = poool.request();

      const result = await request.query(query);
      return result;
    } catch (err) {
      //logger.info(err);
      console.log(err);
    };
};

async function execTranSql(request, query, params) {
  try {
    console.log(query + JSON.stringify(params)+ "\n\n");

    Object.entries(params).forEach(([key, value]) => {
      try{
        request.input(key, value);
      } catch(err){
        
      }
    });
    const result = await request.query(query);
    return result;
  } catch (err) {
    //logger.info(err);
    throw new Error(err);
  };
}

module.exports = {execSql, execSqlNoParams, execSqlNoLog, execTranSql};
