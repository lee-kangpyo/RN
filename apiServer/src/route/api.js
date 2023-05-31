const express = require('express')
var router = express.Router();
const execSql = require("../util/executeSql");

const test = `select * from PLYMUSER`
router.post("/v1/test", async (req, res, next)=>{
    const result = await execSql(test, []);
    console.log(result)
})

module.exports = router;