const express = require('express')
var router = express.Router();
const {execSql} = require("../../utils/excuteSql");
const { createTmpStore, createCstUser, updateTmpStore, updateCstUser } = require('../../query/v2/crew');
const { saveAlbaWork } = require('../../query/v2/manageCrew');


router.post("/createTmpStore", async (req,res,next)=>{
    console.log("POST v2.crew.createTmpStore 알바 임시 점포 생성")
    try {
        const { wage, cstNa, isWeekWage, userId, jobType, mealAllowance, isSch } = req.body;
        console.log(wage, cstNa, isWeekWage, userId, jobType, mealAllowance, isSch);
        // PLYMCST에 insert
        const result = await execSql(createTmpStore, {cstNa, userId});
        // PLYMCSTUSER에 insert
        const cstCo = result.recordset[0].CSTCO;
        await execSql(createCstUser, {cstCo, wage, userId});
        //
        await execSql(saveAlbaWork, {jobType, wage, mealAllowance, isWeekWage:(isWeekWage)?"Y":"N", isSch:(isSch)?"Y":"N", iUserId:userId, cstCo, userId});
        res.status(200).json({resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.post("/updateTmpStore", async (req,res,next)=>{
    console.log("POST v2.crew.updateTmpStore 알바 임시 점포 수정")
    try {
        const { cstCo, wage, cstNa, isWeekWage, userId, jobType, mealAllowance, isSch } = req.body;
        console.log(cstCo, wage, cstNa, isWeekWage, userId, jobType, mealAllowance, isSch);
        // PLYMCST에 insert
        await execSql(updateTmpStore, {cstCo, cstNa, userId});
        // PLYMCSTUSER에 insert
        await execSql(updateCstUser, {cstCo, wage, userId});
        //
        await execSql(saveAlbaWork, {jobType, wage, mealAllowance, isWeekWage:(isWeekWage)?"Y":"N", isSch:(isSch)?"Y":"N", iUserId:userId, cstCo, userId});
        res.status(200).json({resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

module.exports = router;