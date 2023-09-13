const express = require('express')
var router = express.Router();

const { getTraceUserList, getMyuserTrace, getStoreInfo } = require('../query/admin'); 

const runMyQuery = require('../utils/MySqlQuery');

router.get("/getTraceUserList", async (req, res, next) => {
    console.log("getTraceUserList")
    const result = await runMyQuery(getTraceUserList);
    res.status(200).json({ result:result});
})

router.get("/getMyusersTrace", async (req, res, next) => {
    console.log("getMyuserTrace")
    const result = await runMyQuery(getMyusersTrace);
    console.log(result)
    res.status(200).json({ result:result});
})

router.get("/getMyuserTrace", async (req, res, next) => {
    console.log("getMyuserTrace")
    const {userId, uuid} = req.query;
    const result = await runMyQuery(getMyuserTrace, [userId, uuid]);
    res.status(200).json({ result:result});
})

router.get("/getStoreInfo", async (req, res, next)=>{
    console.log("getStoreInfo")
    const result = await runMyQuery(getStoreInfo);
    res.status(200).json({ result:result});
})


module.exports = router;

