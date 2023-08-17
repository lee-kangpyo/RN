const sql = require('mssql');
const { pool } = require('../config/pool');

// 트랜잭션 미들웨어
const transactionMiddleware = async (req, res, next) => {

  try {
    const poool = await pool;
    const transaction = new sql.Transaction(poool);
    
    // 트랜잭션 시작
    await transaction.begin();

    // req 객체에 트랜잭션을 추가하여 다음 미들웨어에서 사용할 수 있도록 함
    req.transaction = transaction;

    // 다음 미들웨어로 이동
    next();
  } catch (error) {
    // 트랜잭션 롤백
    await transaction.rollback();

    console.error('Transaction failed:', error);
    res.status(500).json({ error: 'Transaction failed' });
  }
};

module.exports = transactionMiddleware;