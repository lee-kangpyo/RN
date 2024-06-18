const express = require('express')
var router = express.Router();
const {execSql} = require("../../utils/excuteSql");

const dotenv = require('dotenv');
const { jobChk, jobChk2, albaSchedulemanager2 } = require('../../query/auth');
const { monthCstSlySearch } = require('../../query/workResult');
const { insertManualJobChk, daySchedule, reqCommuteChange, initCommuteChange, getReqCommuteList, updateJobReq, updateDayJob, getDAYJOBREQ, getReqCommuteListForDay, insertPLYADAYJOB, updateJobReqAbsence, getJobNo, updatePLYADAYJOB, getReqCommuteListForMonth } = require('../../query/commute');
const { reverseGeocode } = require('../../utils/kakao');
const { sendPush_GoToWork, sendPush_GetOffWork } = require('../../utils/templatePush');
const { sendMsg_Z0110_11, useN_DayJob } = require('../../query/dailyReport');
const { AlbaJobSave } = require('../../query/v2/commute');
dotenv.config();



router.post("/reqCommuteChange", async (req,res,next)=>{
    console.log("POST commute.reqCommuteChange v2")
    const convertYmd = (dateString) => {
        // 주어진 날짜 문자열
        //var dateString = "2024-02-15 13:30";

        // 날짜 객체 생성
        var dateObject = new Date(dateString);

        // 년, 월, 일 가져오기
        var year = dateObject.getFullYear();
        var month = dateObject.getMonth() + 1; // 월은 0부터 시작하므로 1을 더합니다.
        var day = dateObject.getDate();

        // 월과 일이 한 자리 수인 경우 앞에 0을 추가해줍니다.
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }

        // 변환된 날짜 문자열
        return "" + year + month + day;
    }
    
    try {
        const { cstCo, userId, jobNo, sTime, eTime, startTime, endTime, reason, reqStat, issueCount } = req.body;
        console.log(cstCo, userId, jobNo, sTime, eTime, startTime, endTime, reason, reqStat, issueCount);
        const ymd = convertYmd(sTime);
        res.status(200).json({result:"다녀옴", resultCode:"00"});

        // const initRlt = await execSql(initCommuteChange, {cstCo, jobNo, userId, ymd});
        // const result = await execSql(reqCommuteChange, { cstCo, jobNo, userId, sTime, eTime, startTime, endTime, reason, reqStat, ymd });
        // const reqNo = result.recordset[0].REQNO;
        // if(jobNo == "999999"){
        //     await execSql(insertPLYADAYJOB, {userId, reqNo});
        //     const rslt = await execSql(getJobNo, {userId, reqNo});
        //     await execSql(updateJobReqAbsence, {reqStat, userId, reqNo, jobNo:rslt.recordset[0].JOBNO});
        // }else if (issueCount > 0){
        //     await execSql(updatePLYADAYJOB, {userId, sTime, eTime, jobNo});
        // }
        // if(result.rowsAffected[0] == 1){
        //     res.status(200).json({result:"다녀옴", resultCode:"00"});
        // }else{
        //     res.status(200).json({result:"요청 중 알수 없는 오류가 발생했습니다.", resultCode:"-1"});
        // }
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})


router.post("/AlbaJobSave", async (req,res,next)=>{
    console.log("POST v2.commute.AlbaJobSave ")
    try {
        const { ymd, cstCo, userId, sTime, eTime, jobCl, brkDure } = req.body;
        console.log(ymd, cstCo, userId, sTime, eTime, jobCl, brkDure);
        const result = await execSql(AlbaJobSave, {ymd, cstCo, userId, sTime, eTime, jobCl, brkDure});
        console.log(result);
        res.status(200).json({resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})


router.post("/AlbaSchSave", async (req,res,next)=>{
    console.log("POST v2.commute.AlbaSchSave - 알바 근무 계획입력")
    try {
        // exec PR_PLYA02_ALBASCHMNG @cls, @cstCo, @userId, @ymdFr, @ymdTo, @jobCl, @sTime, @eTime
        // exec PR_PLYA02_ALBASCHMNG ‘WeekAlbaScheduleSave’, ‘1021’, ‘Sksksksk’, ‘20240617’, ‘’, ‘2’, ‘07:00’, ‘12:00’
        const { ymdFr, ymdTo, cstCo, userId, sTime, eTime, jobCl } = req.body;
        console.log(ymdFr, ymdTo, cstCo, userId, sTime, eTime, jobCl);
        const result = await execSql(albaSchedulemanager2, {cls:"WeekAlbaScheduleSave", ymdFr, ymdTo, cstCo, userId, sTime, eTime, jobCl});
        res.status(200).json({resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})



module.exports = router;

