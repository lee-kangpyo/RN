const express = require('express')
var router = express.Router();
const {execSql} = require("../utils/excuteSql");

const dotenv = require('dotenv');
const { jobChk, jobChk2 } = require('../query/auth');
const { monthCstSlySearch } = require('../query/workResult');
const { insertManualJobChk, daySchedule } = require('../query/commute');
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
        // 1. JOBYN ==> CHKYN 필드명 변경, 입력시 I(출근), X(퇴근)으로 내용 변경
        // 2. DAY ==> YMD 필드명 변경 및 일자로 변경 -> query에서 해결
        // 3. JOBCL 추가, G:일반, S:대타
        const result = await execSql(insertManualJobChk, {userId:userId, cstCo:cstCo, lat:lat, lon:lon, chkYn:chkYn, apvYn:apvYn, jobCl:jobCl});
        res.status(200).json({result:result.recordset, resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.get("/daySchedule", async (req,res,next)=>{
    console.log("POST commute.daySchedule")
    try {
        const {cstCo, userId, ymd} = req.query;
        const result = await execSql(daySchedule, {cls:"WeekAlbaScheduleSearch", userId, cstCo, ymdFr:ymd, ymdTo:ymd});
        res.status(200).json({result:result.recordset, resultCode:"00"});
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

