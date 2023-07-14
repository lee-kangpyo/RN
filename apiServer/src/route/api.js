const express = require('express')
var router = express.Router();
const {execSql, execTranSql} = require("../utils/excuteSql");

const { login, test, isIdDuplicate, saveUser, getStoreList, insertMCST, insertMCSTUSER, getStoreListCrew, searchCrewList, changeCrewRTCL, searchMyAlbaList } = require('./../query/auth'); 
const axios = require('axios');

const dotenv = require('dotenv');
const transactionMiddleware = require('../utils/transactionMiddleware');
dotenv.config();

router.get("/v1/test", async (req, res, next)=>{
    const result = await execSql(test, {userId:'asdf'})
    res.json({status_code:"00", result:result.recordset, length:result.rowsAffected}); 
})

router.get("/v1/login", async(req, res, next)=>{
    const {id, passWord} = req.query;
    const result = await execSql(login, {userId:id, passWord:passWord})
    res.json({status_code:"00", result:result.recordset, length:result.rowsAffected}); 
})

router.post("/v1/loginUser", async(req, res, next)=>{
    console.log("/v1/loginUser")
    const {id, password} = req.body;
    const result = await execSql(login, {userId:id, passWord:password})
    let data = null;
    let info = {};
    if(result.recordset[0]){
        const {pwCheck, crewYn, ownrYn, mnrgYn, userNa} = result.recordset[0];
        data = pwCheck;
        info = {ownrYn:ownrYn, crewYn:crewYn, mnrgYn:mnrgYn, userNa:userNa}
    }
    
    res.json({status_code:"00", result:data, info:info, length:result.rowsAffected[0]}); 
})

router.post("/v1/isIdDuplicate", async(req, res, next)=>{
    const {id} = req.body;
    const result = await execSql(isIdDuplicate,{userId:id})
    let isDuplicate = true;
    if(result.recordset[0].cnt === 0){
        isDuplicate = false
    }
    //const result = await execSql(login, {userId:id, passWord:passWord})
    res.json({status_code:"00", isDuplicate:isDuplicate}); 
})

router.post("/v1/saveUser", async(req, res, next)=>{
    const {hpNo, id, password, userName, ownrYn, mnrgYn, crewYn} = req.body;
    console.log(id, hpNo, password, userName);
    const result = await execSql(saveUser, {userId:id, passWord:password, hpNo:hpNo, userName:userName, ownrYn:ownrYn, mnrgYn:mnrgYn,crewYn:crewYn})
    const resultObj = {status_code:"00", result:true};
    if(result.rowsAffected[0] == 0){
        resultObj.result = false;
    }
    res.json(resultObj); 
})

router.get("/v1/getStoreList", async (req, res, next) => {
    const {userId} = req.query;
    const result = await execSql(getStoreList, {userId:userId})
    console.log(result.recordset);
    res.json({result:result.recordset, status_code:"00"});
})

router.get("/v1/getStoreListCrew", async (req, res, next) => {
    const {cstNa} = req.query;
    const result = await execSql(getStoreListCrew, {cstNa:cstNa})
    console.log(result.recordset);
    res.json({result:result.recordset, status_code:"00"});
})


router.get("/v1/getLatLon", async (req, res, next) => {
    const {address, zoneCode} = req.query;
    const key = process.env.KAKAO_API
    let result = {resultCode:"-1", lat:null, lon:null}

    console.log(req)

    await axios.get("https://dapi.kakao.com/v2/local/search/address", {
        params: {
            query: address
        },
        headers:{
            "content-type":"application/json;charset=UTF-8",
            "Authorization": `KakaoAK ${key}`
        }
    })
    .then(function (response) {
        result = {
            resultCode:"00", 
            lat:response.data.documents[0].y, 
            lon:response.data.documents[0].x
        }
    }).catch(function (error) {
        // 오류발생시 실행
        console.log(error)
    }).then(function() {
        // 항상 실행
        //console.log("항상 실행")
    });
    res.json(result)
})

router.get("/v1/checkTaxNo", async (req, res, next) => {
    const {taxNo} = req.query;
    const key = process.env.TAXNO_API
    let result = {resultCode:"-1", result:""}

    await axios.post(`https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${key}`, {
        "b_no": [
            taxNo
        ]
    })
    .then(function (response) {
        console.log(response.data.data[0])
        result.result = response.data.data[0]
    }).catch(function (error) {
        // 오류발생시 실행
        console.log(error)
    });
    res.json(result)
})

router.post("/v1/addStore", transactionMiddleware, async (req, res, next) => {
    let transaction; // 트랜잭션 객체 선언
    try {
        // req 객체에서 트랜잭션 가져오기
        transaction = req.transaction; // 트랜잭션 객체 초기화
        const request = transaction.request();

        //데이터 전처리
        const {lat, lon, address, zoneCode, taxNo, cstNa, detailAddress, userId, userNa} = req.body;
        let result = {resultCode:"-1", result:""}

        //const MCSTUSERresult = await execSql(insertMCSTUSER, {userId:userId})
        console.log({cstNa:cstNa, cstCl:"COFFE", taxNo:taxNo, zipNo:zoneCode, zipAddr:address, addr:detailAddress, lat:lat, lon:lon, userId:userId, repNa:userNa})
        const rlt = await execTranSql(request, insertMCST, {cstNa:cstNa, cstCl:"COFFE", taxNo:taxNo, zipNo:zoneCode, zipAddr:address, addr:detailAddress, lat:lat, lon:lon, userId:userId, repNa:userNa})
        console.log(rlt)
        console.log("########################################33")
        // SQL 쿼리 실행
        const cstCo = rlt.recordset[0].CSTCO;
        
        const rlt2 = await execTranSql(request, insertMCSTUSER, {cstCo:cstCo, userId:userId, iUserId:userId, roleCl:"ownr", rtCl:"N"})
        console.log(rlt2)

        // 트랜잭션 커밋

        await transaction.commit();
    
        res.status(200).json({ resultCode:"00", result:rlt.rowsAffected[0] + rlt2.rowsAffected[0] });
      } catch (error) {
        // 트랜잭션 롤백
        console.log(error)
        await transaction.rollback();
        res.status(200).json({ resultCode:"-1"});
      }
})

// 알바생 점포 지원
router.post("/v1/applyStoreListCrew", async (req, res, next) => {
    try{
        const {cstCo, userId, iUserId, roleCl} = req.body;
        const result = await execSql(insertMCSTUSER, {cstCo:cstCo, userId:userId, iUserId:iUserId, roleCl:roleCl, rtCl:"R"})
        console.log({result:result.recordset, resultCode:"00"})
        res.status(200).json({result:result.recordset, resultCode:"00"});
    } catch (err) {
        console.log("###"+err.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.get("/v1/searchCrewList", async (req, res, next) => {
    try {
        const {userId} = req.query;
        const result = await execSql(searchCrewList, {userId:userId}) 
        console.log(result)
        res.status(200).json({result:result.recordset, resultCode:"00"});
    } catch (err) {
        console.log("###"+err.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.post("/v1/approvCrew", async (req, res, next)=>{
    try {
        const {cstCo, userId} = req.body;
        const result = await execSql(changeCrewRTCL, {userId:userId, cstCo:cstCo, rtCl:"N"}) 
        res.status(200).json({result:result.rowsAffected[0], resultCode:"00"});
    } catch (error) {
        console.log("###"+error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.get("/v1/searchMyAlbaList", async (req, res, next) => {
    try {
        const {userId} = req.query;
        const result = await execSql(searchMyAlbaList, {userId:userId});
        res.status(200).json({result:result.recordset, resultCode:"00"});
    } catch (error) {
        console.log("###"+error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

module.exports = router;

