const express = require('express')
var router = express.Router();
const {execSql} = require("../../utils/excuteSql");
const { updateAlbaInfo, mergeAlbaWeekInfo, UseNAlbaWeekInfo, UseNAlbaWeeksInfo, searchAlbaWork, saveAlbaWork, saveAlbaJobTime, delAlbaJobTime, delAllAlbaJobTime, searchStoreByAlba, searchWeekByAlba } = require('../../query/v2/manageCrew');

const getTime = (dateString) => {
    // Date 객체로 변환
    const date = new Date(dateString);
    // 시간 추출
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    // 시간 문자열 생성
    const timeString = `${hours}:${minutes}`;
    return timeString;
};
router.get("/searchAlbaWorkByAlba", async (req,res,next)=>{
    console.log("POST v2.manageCrew.searchAlbaWork 알바가 점포 기본 정보 호출")
    try {
        const {cstCo, userId} = req.query;
        console.log(cstCo, userId);
        const result = await execSql(searchStoreByAlba, {userId});
        const result2 = await execSql(searchWeekByAlba, {userId:"mangdee22"});
        
        const storeInfo = result.recordset ?? [];
        //const storeInfo = [];
        const albaWeeks = result2.recordset ?? [];
        for (store of storeInfo){
            const filtered = albaWeeks.filter(el => el.CSTCO == store.CSTCO);
            const weeks = {0:[],1:[],2:[],3:[],4:[],5:[],6:[],6:[]}
            //if(filtered.length > 0 && store.ISSCHYN && store.ISSCHYN == "Y"){
            if(filtered.length > 0){
                // 배열 생성
                const arr = Array.from({ length: 7 }, (_, index) => index + 1);
                // for 문을 사용하여 배열 순회
                for (let i = 0; i < arr.length; i++) {
                    const jobWeek = arr[i];
                    const target = filtered.find(el => el.JOBWEEK == jobWeek);
                    if(target){
                        weeks[i] = [getTime(target.JOBSTARTTIME), getTime(target.JOBENDTIME), target.JOBDURE];
                    }
                }
                console.log(weeks);
                store["weeks"] = weeks;
            }else{
                store["weeks"] = weeks;
            }
            
            //console.log("###");
            //console.log(storeInfo);
            //console.log("###");
        }
        res.status(200).json({resultCode:"00", storeInfo:storeInfo});

    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})
router.get("/searchAlbaWork", async (req,res,next)=>{
    console.log("POST v2.manageCrew.searchAlbaWork 점주가 알바 관리에서 기본 정보 호출")
    try {
        const {cstCo, userId} = req.query;
        console.log(cstCo, userId);
        const result = await execSql(searchAlbaWork, {cstCo, userId});
        const albaWork = result.recordset;

        let basicInfo = {};
        const weeks = {0:[],1:[],2:[],3:[],4:[],5:[],6:[],6:[]}
        if (albaWork.length > 0){
            // 기초 속성 생성
            const f = albaWork[0];
            basicInfo = {jobType:f.JOBTYPE, basicWage:f.BASICWAGE, mealAllowance:f.MEALALLOWANCE, isWeekWage:f.WEEKWAGEYN, isSch:f.ISSCHYN};
            // 배열 생성
            const arr = Array.from({ length: 7 }, (_, index) => index + 1);
            // for 문을 사용하여 배열 순회
            for (let i = 0; i < arr.length; i++) {
                const jobWeek = arr[i];
                const target = albaWork.find(el => el.JOBWEEK == jobWeek);
                if(target){
                    weeks[i] = [getTime(target.JOBSTARTTIME), getTime(target.JOBENDTIME), target.JOBDURE];
                }
            }
            res.status(200).json({resultCode:"00", basicInfo:basicInfo, weeks:weeks});
        }else{
            res.status(200).json({resultCode:"01"});
        }
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.post("/update", async (req,res,next)=>{
    console.log("POST v2.manageCrew.update 알바 정보 수정")
    try {
        const { jobType, wage, mealAllowance, isWeekWage, isSch, weeks, cstCo, userId, iUserId } = req.body;
        console.log(jobType, wage, mealAllowance, isWeekWage, isSch, weeks, cstCo, userId, iUserId);
        await execSql(saveAlbaWork, {jobType, wage, mealAllowance, isWeekWage:(isWeekWage)?"Y":"N", isSch:(isSch)?"Y":"N", iUserId, cstCo, userId});
        if(isSch){
            console.log("고정근무시간 있음")
            // PLYMCSTFIXEDSCH를 7번 돌면서 호출 -> 저장하는 방식은
            // true이면 merge
            // false 이면 존재하지 않으면 N처리
            for (const idx in weeks) {
                console.log(idx);
                const week = weeks[idx];
                if(weeks[idx].length > 0){
                    console.log("체크됨")
                    const sTime = week[0];
                    const eTime = week[1];
                    const jobDure = week[2];
                    await execSql(saveAlbaJobTime, {cstCo, userId, week:Number(idx)+1, sTime, eTime, jobDure, iUserId});
                }else{
                    console.log("해제됨")
                    await execSql(delAlbaJobTime, {cstCo, userId, week:Number(idx)+1, iUserId});
                }
            }
        }else{
            console.log("고정근무시간 없음")
            // PLYMCSTFIXEDSCH 모두 N 처리
            const weeks = [1,2,3,4,5,6,7]
            for (const week of weeks) {
                await execSql(delAlbaJobTime, {cstCo, userId, week:week, iUserId});
            }
            //await execSql(delAllAlbaJobTime, {cstCo, userId, iUserId});
        }
        res.status(200).json({resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

module.exports = router;