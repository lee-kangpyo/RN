const express = require('express')
var router = express.Router();
const {execSql} = require("../utils/excuteSql");
const {sendPush}  = require("../utils/expoPush");

const axios = require('axios');

const dotenv = require('dotenv');
dotenv.config();

router.get("/test", async (req, res, next)=>{
    console.log("ASdf");
    sendPush(["ExponentPushToken[CQezQ8E5qrty6jieuuFFdf]", "ExponentPushToken[fMYpL2EVQKs008sBpD8_Xx]"]);
    res.json({status_code:"00", result:"테스트"}); 
})

module.exports = router;