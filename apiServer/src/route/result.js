const express = require('express')
var router = express.Router();
const {execSql, execTranSql} = require("../utils/excuteSql");

const dotenv = require('dotenv');
const { monthCstSlySearch } = require('../query/workResult');
const { salary } = require('../query/auth');

dotenv.config();

router.get("/monthCstSlySearch", async (req, res, next) => {
    console.log("GET result.monthCstSlySearch");
    try {
        const {cls, ymdFr, ymdTo, cstCo, cstNa, userId, userNa, rtCl} = req.query;
        const spcAmt = (rtCl == "")?"0":rtCl;
        const param = {cls, ymdFr, ymdTo, cstCo, cstNa, userId, userNa, rtCl:spcAmt};
        const result = await execSql(monthCstSlySearch, param)
        res.status(200).json({result:result.recordset, resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.get("/excelData", async (req, res, next) => {
    console.log("GET result.excelData");
    const {ymdFr, ymdTo, cstCo} = req.query
    const result = await execSql(salary, {userId:"", cls:"salaryMonth", ymdFr:ymdFr, ymdTo:ymdTo, cstCo:cstCo});
    res.status(200).json({resultCode:"00", result:result.recordset});
})

module.exports = router;