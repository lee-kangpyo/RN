const express = require('express')
var router = express.Router();
const {execSql, execTranSql} = require("../utils/excuteSql");
const { PLmanager, getCustomPlData, saveCustomPlData, getCustomCategory, addCustomCategory, delCustomCategory, updateCustomCategory } = require('../query/profitAndLoss');
const { monthCstSlySearch } = require('../query/workResult');

// /api/v1/profitAndLoss
router.get("/execPL", async (req, res, next)=>{
    console.log("profitAndLoss.ecexPL");
    try {
        const{cls, ymdFr, ymdTo, cstCo, plItCo, amt} = req.query;
        const param = {cls:cls, ymdFR:ymdFr, ymdTo:ymdTo, cstCo:cstCo, plItCo:plItCo, amt:amt};
        const result = await execSql(PLmanager, param)
        if(cls == "MonCstPlSearch"){
            const customPlData = await execSql(getCustomPlData, {cstCo, ymdFr, ymdTo})            
            res.status(200).json({result:result.recordset, customPl:customPlData.recordset, resultCode:"00"});
        }else{
            res.status(200).json({result:result.recordset, resultCode:"00"});    
        }
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.get("/execCustomPL", async (req, res, next)=>{
    console.log("profitAndLoss.execCustomPL");
    try {
        const{ymdFr, ymdTo, cstCo, categoryNo, amt, userId} = req.query;
        console.log(ymdFr, ymdTo, cstCo, categoryNo, amt, userId);

        const param = {ymd:ymdTo, cstCo:cstCo, categoryNo, amt, userId};
        const result = await execSql(saveCustomPlData, param)
        res.status(200).json({resultCode:"00"});    
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
        res.status(200).json({result:result.recordset, resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.get("/getCustomCategory", async (req, res, next)=>{
    console.log("profitAndLoss.getCustomCategory");
    try {
        const{cstCo} = req.query;
        const result = await execSql(getCustomCategory, {cstCo})
        res.status(200).json({result:result.recordset, resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.post("/addCustomCategory", async (req, res, next)=>{
    console.log("profitAndLoss.addCustomCategory");
    try {
        const{cstCo, cName, userId} = req.body;
        console.log(cstCo, cName, userId)
        await execSql(addCustomCategory, {cstCo, cName, userId})
        res.status(200).json({resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.delete("/customCategory", async (req, res, next)=>{
    console.log("profitAndLoss.customCategory - delete로 호출");
    try {
        const{categoryNo, userId, cstCo} = req.body;
        console.log(req.body);
        console.log("삭제한 아이디 : " + userId);
        console.log("PLYECUSTOMCATEGORY pk:" + categoryNo)
        await execSql(delCustomCategory, {categoryNo, userId, cstCo})
        res.status(200).json({resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.put("/customCategory", async (req, res, next)=>{
    console.log("profitAndLoss.customCategory - put으로 호출");
    try {
        const{categoryNo, userId, cstCo, cName} = req.body;
        console.log("업데이트한 아이디 : " + userId);
        console.log("수정된 이름 : " + cName);
        console.log("PLYECUSTOMCATEGORY pk:" + categoryNo)
        await execSql(updateCustomCategory, {categoryNo, userId, cstCo, cName})
        res.status(200).json({resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})


module.exports = router;

