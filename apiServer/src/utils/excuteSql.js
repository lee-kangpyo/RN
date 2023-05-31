const logger = require("../logger");
const { pool } = require('../config/pool');

async function executeSql(query, params) {
    try {
        const poool = await pool;    
        const request = poool.request();
        Object.entries(params).forEach(([key, value]) => {
          request.input(key, value);
        });
        const result = await request.query(query);

        logger.info(query + JSON.stringify(params)+ "\n\n");
        return result;
      } catch (err) {
        logger.info(err);
        throw new Error(err);
      };
};

module.exports = executeSql;
