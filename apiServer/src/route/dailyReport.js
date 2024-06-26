const express = require('express')
var router = express.Router();
const {execSql} = require("../utils/excuteSql");

const dotenv = require('dotenv');
const { DailyReport1, approve, jobClose, JumjoWorkSave } = require('../query/dailyReport');

dotenv.config();

// /v1/daily/DailyReport1
router.get("/DailyReport1", async (req, res, next)=>{
    console.log("GET dailyReport.DailyReport1");
    try {
        const {cstCo, ymd} = req.query;
        const result = await execSql(DailyReport1, {cstCo, ymd});
        res.status(200).json({result:result.recordset, resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

// /v1/daily/approve
router.post("/approve", async (req, res, next)=>{
    console.log("POST dailyReport.approve");
    try {
        const {jobNos, userId, ymd, cstCo} = req.body;
        const result = await execSql(approve + "("+jobNos.join(", ")+")", {userId});
        if(result && result.rowsAffected > 0){
            const result2 = await execSql(jobClose, {ymdFr:ymd, ymdTo:ymd, cstCo:cstCo})   
        }
        res.status(200).json({rowsAffected:result.rowsAffected[0], resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

// /v1/daily/JumjoWorkSave 
router.post("/JumjoWorkSave", async (req, res, next)=>{
    console.log("POST dailyReport.JumjoWorkSave");
    try {
        const {cls, cstCo, useId, ymd, sTime, eTime, jobCl} = req.body
        const result = await execSql(JumjoWorkSave, {cls, cstCo, useId, ymd, sTime, eTime, jobCl})
        console.log(result);
        res.status(200).json({resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})
module.exports = router;

