const express = require('express')
var router = express.Router();
const {execSql, execTranSql} = require("../utils/excuteSql");

const dotenv = require('dotenv');
const { salary } = require('../query/auth');

dotenv.config();

router.post("/test", async (req, res, next) => {
    console.log("POST web.test");
    const {id} = req.body
    console.log(id)
    //const result = await execSql(salary, {userId:"", cls:"salaryMonth", ymdFr:ymdFr, ymdTo:ymdTo, cstCo:cstCo});
    res.status(200).json({resultCode:"00", result:"다녀옴"});
})

module.exports = router;