const express = require('express')
var router = express.Router();
const {execSql} = require("../utils/excuteSql");
const {sendPush, checkTicket}  = require("../utils/expoPush");

const axios = require('axios');

const dotenv = require('dotenv');
dotenv.config();

router.get("/test", async (req, res, next)=>{
    console.log("test");
    //sendPush(["hH-w5iBNoyx5lpqCeRg7sw", "fkqkgnChudm9c2A7_015hL"]);
    sendPush([ "oDUOauOiW_AIgC4YvagvKF"]);
    res.json({status_code:"00", result:"테스트"});
})

router.get("/testicket", async (req, res, next)=>{
    console.log("testicket");
    checkTicket(
        [ { status: 'ok', id: '90487d8c-1020-411d-b3a7-666b20d85449' } ]
    );
    //sendPush([ "fkqkgnChudm9c2A7_015hL"]);
    res.json({status_code:"00", result:"테스트"}); 
})

module.exports = router;

