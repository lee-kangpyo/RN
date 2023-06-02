const express = require('express')
var router = express.Router();
const execSql = require("../utils/excuteSql");
const { login, test, isIdDuplicate, saveUser } = require('./../query/auth'); 



router.get("/v1/test", async (req, res, next)=>{
    const result = await execSql(test, {userId:'asdf'})
    res.json({status_code:"00", result:result.recordset, length:result.rowsAffected}); 
})

router.get("/v1/login", async(req, res, next)=>{
    const {id, passWord} = req.query;
    const result = await execSql(login, {userId:id, passWord:passWord})
    res.json({status_code:"00", result:result.recordset, length:result.rowsAffected}); 
})

router.post("/v1/login", async(req, res, next)=>{
    const {id, passWord} = req.body;
    const result = await execSql(login, {userId:id, passWord:passWord})
    res.json({status_code:"00", result:result.recordset, length:result.rowsAffected}); 
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
    const {hpNo, id, password, userName} = req.body;
    console.log(id, hpNo, password, userName);
    const result = await execSql(saveUser, {userId:id, passWord:password, hpNo:hpNo, userName:userName})
    const resultObj = {status_code:"00", result:true};
    if(result.rowsAffected[0] == 0){
        resultObj.result = false;
    }
    res.json(resultObj); 
})

module.exports = router;

