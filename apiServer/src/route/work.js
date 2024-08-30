const express = require('express')
var router = express.Router();
const {execSql, execTranSql} = require("../utils/excuteSql");

const axios = require('axios');

const dotenv = require('dotenv');
const transactionMiddleware = require('../utils/transactionMiddleware');
const { albaWorkManager, getWage, getAbsent } = require('../query/workResult');
dotenv.config();


router.all("/workChedule", async (req, res, next) => {
    if (req.method === 'GET' || req.method === 'POST') {
        console.log("work.workChedule");
        console.log("method : "+req.method)
        try {
            const{cls, cstCo, userId, ymdFr, ymdTo, jobCl, jobDure, wage} = (req.method === 'GET')?req.query:req.body;
            console.log("cls : "+cls)
            // 초기화
            const param = {cls:cls, cstCo:cstCo, userId:userId, ymdFr:ymdFr, ymdTo:ymdTo, jobCl:jobCl, jobDure:jobDure, wage:wage};
            const result = await execSql(albaWorkManager, param)
            if(cls == "WeekWorkSearch"){
                const result2 = await execSql(getWage, {cstCo});
                const absentInfo = await execSql(getAbsent, {cstCo, ymdFr, ymdTo})
                res.status(200).json({result:result.recordset, wageInfo:result2.recordset, absentInfo:absentInfo.recordset, resultCode:"00"});
            }else{
                res.status(200).json({result:result.recordset, resultCode:"00"});
            }
        } catch (error) {
            console.log(error.message)
            res.status(200).json({ resultCode:"-1"});
        }
    }else{
        res.status(400).send('Bad Request');
    }
})

module.exports = router;