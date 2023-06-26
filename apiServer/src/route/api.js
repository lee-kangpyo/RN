const express = require('express')
var router = express.Router();
const execSql = require("../utils/excuteSql");
const { login, test, isIdDuplicate, saveUser } = require('./../query/auth'); 
const axios = require('axios');

const dotenv = require('dotenv');
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
    
    let data = null
    if(result.recordset[0]){
        const {USERID, USERNA} = result.recordset[0]
        data = {USERID, USERNA}
    }
    
    console.log({status_code:"00", result:data, length:result.rowsAffected[0]})
    res.json({status_code:"00", result:data, length:result.rowsAffected[0]}); 
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

router.get("/v1/getLatLon", async (req, res, next) => {
    const {address, zoneCode} = req.query;
    const key = process.env.KAKAO_API
    let result = {resultCode:"-1", lat:null, lon:null}

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
        console.log("항상 실행")
    });
    res.json(result)
})

module.exports = router;

