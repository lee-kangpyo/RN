const express = require('express')
var router = express.Router();
const {execSql} = require("../utils/excuteSql");

const dotenv = require('dotenv');
const { jobChk, jobChk2 } = require('../query/auth');
const { monthCstSlySearch } = require('../query/workResult');
const { insertManualJobChk, daySchedule, reqCommuteChange, initCommuteChange, getReqCommuteList, updateJobReq, updateDayJob, getDAYJOBREQ } = require('../query/commute');
const { reverseGeocode } = require('../utils/kakao');
dotenv.config();

function getDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}


router.get("/jobchksearch", async (req, res, next)=>{
    console.log("GET commute.jobchksearch");
    try {
        const {userId, cstCo} = req.query;
        const result = await execSql(jobChk, {cls:"jobchksearch", userId:userId, cstCo:cstCo, ymd:getDate()});
        res.status(200).json({result:result.recordset, resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})


router.get("/commuteCheckInfo", (req, res, next) => {
    console.log("GET commute.commuteCheckInfo - CommuteCheckInfoScreen 에서호출됨");
    jobChk2Handler(req, res, next, false)
});
router.get("/jobDetailInfo", (req, res, next) => {
    console.log("GET commute.jobDetailInfo - CommuteCheckDetailScreen 에서호출됨");
    jobChk2Handler(req, res, next, true)
});
const jobChk2Handler = async (req, res, next, isReverseGeoCode) => {
    try {
        const {cls, userId, cstCo, ymdFr, ymdTo} = req.query;
        const result = await execSql(jobChk2, {cls, userId, cstCo, ymdFr, ymdTo});
        if(isReverseGeoCode){
            const rst = result.recordset
            for (idx in rst){
                const item = rst[idx];
                if( item.LAT !== "" && item.LAT !== "0" && item.LON !== "" && item.LON !== "0" ){
                    const addressObj = await reverseGeocode(item.LAT, item.LON)  
                    item["address"] = addressObj.address.address_name
                }else{
                    item["address"] = ""
                }
            }
        }
        res.status(200).json({result:result.recordset, resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
}


router.get("/monthCstSlySearch", async (req, res, next) => {
    console.log("GET commute.monthCstSlySearch");
    try {
        const {ymdFr, ymdTo, cstCo, userId} = req.query;
        const param = {cls:"MonthAlbaSlySearch", ymdFr, ymdTo, cstCo, cstNa:"", userId, userNa:"", rtCl:0};
        const result = await execSql(monthCstSlySearch, param)
        res.status(200).json({result:result.recordset, resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.post("/insertJobChk", async (req,res,next)=>{
    console.log("POST commute.insertJobChk")
    try {
        const {cstCo, userId, lat, lon, chkYn, apvYn, jobCl} = req.body;
        const result = await execSql(insertManualJobChk, {userId:userId, cstCo:cstCo, lat:lat, lon:lon, chkYn:chkYn, apvYn:apvYn, jobCl:jobCl});
        res.status(200).json({result:result.recordset, resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.get("/daySchedule", async (req,res,next)=>{
    console.log("GET commute.daySchedule")
    try {
        const {cstCo, userId, ymd} = req.query;
        const result = await execSql(daySchedule, {cls:"WeekAlbaScheduleSearch", userId, cstCo, ymdFr:ymd, ymdTo:ymd});
        res.status(200).json({result:result.recordset, resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})


router.post("/reqCommuteChange", async (req,res,next)=>{
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
    console.log("POST commute.reqCommuteChange")
    try {
        const { cstCo, userId, jobNo, sTime, eTime, startTime, endTime, reason, reqStat } = req.body;
        const ymd = convertYmd(sTime);
        const initRlt = await execSql(initCommuteChange, {cstCo, jobNo, userId});
        const result = await execSql(reqCommuteChange, { cstCo, jobNo, userId, sTime, eTime, startTime, endTime, reason, reqStat, ymd });
        if(result.rowsAffected[0] == 1){
            res.status(200).json({result:"다녀옴", resultCode:"00"});
        }else{
            res.status(200).json({result:"요청 중 알수 없는 오류가 발생했습니다.", resultCode:"-1"});
        }
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.get("/getReqCommuteList", async (req,res,next)=>{
    console.log("GET commute.getReqCommuteList - 점주가 알바 근무 수정 정보 호출")
    try {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1; // 월은 0부터 시작하므로 1을 더합니다.
        // 이번달의 첫 번째 날
        const firstDay = `${year}${month.toString().padStart(2, '0')}01`;
        // 이번달의 마지막 날
        const lastDayOfMonth = new Date(year, month, 0);
        const lastDay = `${year}${month.toString().padStart(2, '0')}${lastDayOfMonth.getDate()}`;

        const { userId } = req.query;
        const result = await execSql(getReqCommuteList, {userId, firstDay, lastDay});
        const data = {reqList:result.recordset, resultCode:"00"};
        res.status(200).json(data);
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})


router.post("/albaWorkChangeProcess", async (req,res,next)=>{
    console.log("GET commute.albaWorkChangeProcess - 점주가 알바 근무 수정 승인 거절")
    try {
        const { reqStat, userId, reqNo } = req.body;
        console.log(reqStat, userId, reqNo);
        const result = await execSql(updateJobReq, {reqStat, userId, reqNo});
        
        if(result.rowsAffected[0] == 1){
            if(reqStat == "A")await execSql(updateDayJob, {userId, reqNo, apvYn:'A'});
        }

        //const result = await execSql(getReqCommuteList, {userId});
        //const data = {reqList:result.recordset, resultCode:"00"};
        //console.log(data)
        res.status(200).json({resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.get("/getDayJobReq", async (req, res, next)=>{
    console.log("GET commute.getDayJobReq - 알바가 CommuteCheckChangeScreen 페이지에서 호출")
    try {
        const { jobNo } = req.query;
        const result = await execSql(getDAYJOBREQ, {jobNo});
        res.status(200).json({resultCode:"00", rows:result.rowsAffected[0], result:result.recordset});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

//insertJobChk
// exec PR_PLYD02_SALARY @cls, @ymdFr, @ymdTo, @cstCo, @cstNa, @userId, @userNa, @rtCl
// exec PR_PLYD02_SALARY 'MonthAlbaSlySearch', '20231203', '20231209', 1010, '', 'mega7438226_0075', '', 0
// monthCstSlySearch


module.exports = router;

