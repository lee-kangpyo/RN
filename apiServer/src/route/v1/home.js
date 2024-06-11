const express = require('express')
var router = express.Router();
const {execSql, execTranSql} = require("../../utils/excuteSql");
const { question, questionList, questionDetail, answerList } = require('../../query/v1/qna');
const { MAIN0205, getCstListColor } = require('../../query/v1/home');

function formatDate(dateString) {
    // 날짜 문자열의 길이가 8인지 확인
    if (dateString.length !== 8) {
        //throw new Error("Invalid date format. Expected YYYYMMDD.");
        return "";
    }

    // 연도, 월, 일을 분리
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);

    // 새로운 형식으로 조합
    return `${year}-${month}-${day}`;
}


// /v1/home/MAIN0205
router.get("/MAIN0205", async (req, res, next) => {
    console.log("POST v1.home.MAIN0205 - 알바 달력 뷰 요청");
    try {
        const {userId, ymd} = req.query;
        console.log(userId, ymd);
        console.log("각 점포별 색상 맵핑 정보 할당하기");
        const cstList = await execSql(getCstListColor, {userId});
        console.log("월별 알바가 일한 내역 가져오기");
        const rslt = await execSql(MAIN0205, {userId, ymd:ymd});
        const dayResult = rslt.recordset??[];
        
        const result = {};
        if(dayResult.length > 0){
            console.log("결과 데이터를 정제");
            dayResult.reduce((rlt, next)=>{
                const ymd = formatDate(next.YMD);
                if(!rlt[ymd]) rlt[ymd] = [];
                rlt[ymd].push(next);
                return rlt;
            }, result);
            res.status(200).json({data:result, cstList:cstList.recordset, resultCode:"00"});
        }else{
            res.status(200).json({data:result, cstList:cstList.recordset, resultCode:"00"});
        }
        
    } catch (err) {
        console.log(err.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

module.exports = router;