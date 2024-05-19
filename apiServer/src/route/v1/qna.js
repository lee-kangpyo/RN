const express = require('express')
var router = express.Router();
const {execSql, execTranSql} = require("../../utils/excuteSql");
const { question, questionList, questionDetail, answerList } = require('../../query/v1/qna');

//const dotenv = require('dotenv');
//dotenv.config();

// /qna/v1/question
router.post("/question", async (req, res, next) => {
    console.log("POST qna.question");
    try {
        const {title, content, userId} = req.body
        console.log(title, content, userId)
        const result = await execSql(question, {title, content, userId});
        res.status(200).json({resultCode:"00"});    
    } catch (err) {
        console.log(err.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.get("/question", async(req, res, next) => {
    console.log("GET qna.question");
    try {
        const {userId} = req.query
        const result = await execSql(questionList, {userId});
        res.status(200).json({resultCode:"00", questionList:result.recordset});    
    } catch (err) {
        console.log(err.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.get("/question/:questionNo", async(req, res, next) => {
    console.log("GET qna.questionDetail");
    try {
        const {userId} = req.query
        const {questionNo} = req.params;
        const result = await execSql(questionDetail, {userId, questionNo});
        const result2 = await execSql(answerList, {questionNo});
        res.status(200).json({resultCode:"00", result:result.recordset[0], answerList:result2.recordset});    
    } catch (err) {
        console.log(err.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

module.exports = router;