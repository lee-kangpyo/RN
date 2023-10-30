const express = require('express')
var router = express.Router();
const {execSql, execTranSql} = require("../utils/excuteSql");

const axios = require('axios');

const dotenv = require('dotenv');
const transactionMiddleware = require('../utils/transactionMiddleware');
const { albaWorkManager } = require('../query/workResult');
dotenv.config();


router.all("/workChedule", async (req, res, next) => {
    if (req.method === 'GET' || req.method === 'POST') {
        console.log("work.workChedule");
        try {
            const{cls, cstCo, userId, ymdFr, ymdTo, jobCl, jobDure} = (req.method === 'GET')?req.query:req.body;
            console.log(cls)
            // 초기화
            const param = {cls:cls, cstCo:cstCo, userId:userId, ymdFr:ymdFr, ymdTo:ymdTo, jobCl:jobCl, jobDure:jobDure};
            const result = await execSql(albaWorkManager, param)
            console.log(result);
            res.status(200).json({result:result.recordset, resultCode:"00"});
        } catch (error) {
            console.log(error.message)
            res.status(200).json({ resultCode:"-1"});
        }
    }else{
        res.status(400).send('Bad Request');
    }
})

module.exports = router;