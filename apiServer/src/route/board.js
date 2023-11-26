const express = require('express')
var router = express.Router();
const {execSql} = require("../utils/excuteSql");

const axios = require('axios');

const dotenv = require('dotenv');
const { QnAprocedure } = require('../query/board');
dotenv.config();

const qnaProcedure = async (param) => await execSql(QnAprocedure, param)
// /api/v1/board/QnA
router.get("/QnA", async (req, res, next) => {
    console.log("GET board.QnAmanager");
    try {
        const{cstCo} = req.query;
        const param = {cls:"CstQnASearch", cstCo, userId:"", repNo:0, repSeq:0, contents:""};
        const result = await qnaProcedure(param);
        //console.log(result);
        res.status(200).json({result:result.recordset, resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.post("/QnA", async (req, res, next) => {
    console.log("POST board.QnAmanager");
    try {
        const{cstCo, userId, repNo, repSeq, contents} = req.body;
        const param = {cls:"CstQnASave", cstCo, userId, repNo, repSeq, contents};
        const result = await qnaProcedure(param);
        //console.log(result);
        res.status(200).json({result:result.recordset, resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

module.exports = router;