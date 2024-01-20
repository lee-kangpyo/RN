const express = require('express')
var router = express.Router();
const {execSql, execTranSql} = require("../utils/excuteSql");
const { PLmanager } = require('../query/profitAndLoss');
const { monthCstSlySearch } = require('../query/workResult');

// /api/v1/profitAndLoss
router.get("/execPL", async (req, res, next)=>{
    console.log("profitAndLoss.ecexPL");
    try {
        const{cls, ymdFr, ymdTo, cstCo, plItCo, amt} = req.query;
        // 초기화
        const param = {cls:cls, ymdFR:ymdFr, ymdTo:ymdTo, cstCo:cstCo, plItCo:plItCo, amt:amt};
        const result = await execSql(PLmanager, param)
        res.status(200).json({result:result.recordset, resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.get("/getAlbaFeeList", async (req, res, next)=>{
    console.log("profitAndLoss.getAlbaFeeList");
    try {
        const{ymdFr, ymdTo, cstCo} = req.query;
        // 초기화
        const param = {cls:"MonthCstSlySearch", ymdFr:ymdFr, ymdTo:ymdTo, cstCo:cstCo, cstNa:"", userId:"", userNa:"", rtCl:"0"};
        const result = await execSql(monthCstSlySearch, param)
        //console.log(result);
        res.status(200).json({result:result.recordset, resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})
monthCstSlySearch

module.exports = router;

