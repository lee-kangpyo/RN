const express = require('express')
var router = express.Router();
const {execSql} = require("../utils/excuteSql");
const dotenv = require('dotenv');
const { main02, main01, versionInfo, findId, changePwByIdHpNo } = require('../query/main');
dotenv.config();

// /api/v1/main/versionCheck
router.get("/versionCheck", async (req, res, next) => {
    console.log("GET main.versionCheck");
    try {
        const{platForm} = req.query;
        const result = await execSql(versionInfo, {platForm});
        res.status(200).json({result:result.recordset, resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

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

router.get("/findId", async (req, res, next) => {
    console.log("GET main.findId - 아이디 찾기 시작");
    try {
        const{userNa, hpNo} = req.query;
        const result = await execSql(findId, { userNa, hpNo });

        console.log(userNa, hpNo);
        if(result.recordset.length > 0){
            console.log(result.recordset[0])
            res.status(200).json({result:result.recordset[0], resultCode:"00"});        
        }else{
            console.log("해당하는 사용자 없음")
            res.status(200).json({resultMsg:"입력한 정보에 해당되는 사용자가 없습니다.", resultCode:"-2"});    
        }
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultMsg:"해당되는 사용자가 없습니다.", resultCode:"-1"});
    }
});

router.post("/changePw", async(req, res, next) => {
    console.log("GET main.findId - 비밀번호 변경 시작");
    try {
        const{userId, hpNo, changePw} = req.body;
        console.log(userId, hpNo, changePw);
        
        const result = await execSql(changePwByIdHpNo, { userId, hpNo, passWord:changePw });
        console.log("영향받은 행의 수 - ", result.rowsAffected);
        if(result.rowsAffected > 0){
            res.status(200).json({resultCode:"00"});
        }
        

        //console.log(userNa, hpNo);
        // if(result.recordset.length > 0){
        //     console.log(result.recordset[0])
        //     res.status(200).json({result:result.recordset[0], resultCode:"00"});        
        // }else{
        //     console.log("해당하는 사용자 없음")
        //     res.status(200).json({resultMsg:"입력한 정보에 해당되는 사용자가 없습니다.", resultCode:"-2"});    
        // }
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultMsg:"해당되는 사용자가 없습니다.", resultCode:"-1"});
    }    
});

module.exports = router;