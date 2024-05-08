const express = require('express')
var router = express.Router();
const {execSql} = require("../utils/excuteSql");
const dotenv = require('dotenv');
const { main02, main01 } = require('../query/main');
dotenv.config();

// /api/v1/main/crew
router.get("/crew", async (req, res, next) => {
    console.log("GET main.crew");
    try {
        const{cstCo, userId} = req.query;
        console.log(userId);
        const result0 = await execSql(main02, {cls:"MAIN0200", cstCo:0, userId:userId});
        const result1 = await execSql(main02, {cls:"MAIN0201", cstCo:0, userId:userId});
        const result2 = await execSql(main02, {cls:"MAIN0202", cstCo:0, userId:userId});
        const result3 = await execSql(main02, {cls:"MAIN0203", cstCo:0, userId:userId});
        res.status(200).json({result:{top:result0.recordset[0], TotalSalary:result1.recordset[0], salaryByCst:result2.recordset, TodayStatus:result3.recordset}, resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.get("/owner", async (req, res, next) => {
    console.log("GET main.owner");
    try {
        const{cstCo, userId} = req.query;
        const result1 = await execSql(main01, {cls:'MAIN1100', cstCo, userId});
        const storeList = result1.recordset;
        if(!cstCo && storeList[0].CSTNA == "미등록"){ // cstCo 없고(맨처음 실행) 점포 등록 없음
            console.log("###");
            console.log(result1.recordset[0]);
            res.status(200).json({result:{top:result1.recordset[0], storeList:[], todayAlba:[]}, resultCode:"00"});    
        }else{
            const param = {cls:"MAIN110", cstCo, userId}
            if(!cstCo) param.cstCo = storeList[0].CSTCO;
            const result2 = await execSql(main01, param)    
            res.status(200).json({result:{top:result1.recordset[0], storeList:result1.recordset, todayAlba:result2.recordset, cstCo:param.cstCo}, resultCode:"00"});
        }
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

module.exports = router;