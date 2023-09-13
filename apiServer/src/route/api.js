const express = require('express')
var router = express.Router();
const {execSql, execTranSql} = require("../utils/excuteSql");

const { login, test, isIdDuplicate, saveUser, getStoreList, insertMCST, insertMCSTUSER, 
        getStoreListCrew, searchCrewList, changeCrewRTCL, searchMyAlbaList, jobChk, salary,
        insertJobChk, geofencingTest, checkJobChk, insert_Uuid_Token, autoLogin, getUUID, checkjobtotal, 
        getTermsDetail, updateTaxNo, modifyStoreInfo} = require('./../query/auth'); 
const axios = require('axios');

const dotenv = require('dotenv');
const transactionMiddleware = require('../utils/transactionMiddleware');
dotenv.config();

router.get("/v1/test", async (req, res, next)=>{
    const result = await execSql(test, {userId:'asdf'})
    res.json({status_code:"00", result:result.recordset, length:result.rowsAffected}); 
})

router.get("/v1/login", async(req, res, next)=>{
    const {id, passWord} = req.query;
    const result = await execSql(login, {userId:id, passWord:passWord})
    res.json({status_code:"00", result:result.recordset, length:result.rowsAffected}); 
})

router.post("/v1/loginUser", async(req, res, next)=>{
    console.log("/v1/loginUser")
    const {id, password, uuid, pushToken} = req.body;
    const result = await execSql(login, {userId:id, passWord:password});
    console.log(result)
    let data = null;
    let info = {};
    if(result.recordset[0]){
        const {pwCheck, crewYn, ownrYn, mnrgYn, userNa} = result.recordset[0];
        if (pwCheck === 1 ){ await execSql(insert_Uuid_Token, {userId:id, uuid:uuid, token:pushToken}); }
        data = pwCheck;
        info = {ownrYn:ownrYn, crewYn:crewYn, mnrgYn:mnrgYn, userNa:userNa}
    }
    
    res.json({status_code:"00", result:data, info:info, length:result.rowsAffected[0]}); 
})

router.post("/v1/autoLogin", async(req, res, next)=>{
    const{userId, uuid, flag} = req.body;
    console.log("autoLogin : "+flag);
    const result = await execSql(autoLogin, {userId:userId, uuid:uuid});
    let info = {};
    if(result.recordset[0]){
        console.log("해당 기기는 자동 로그인")
        const {pwCheck, crewYn, ownrYn, mnrgYn, userNa} = result.recordset[0];
        if (pwCheck === 1 ){ await execSql(insertUuid, {userId:id, uuid:uuid}); }
        info = {ownrYn:ownrYn, crewYn:crewYn, mnrgYn:mnrgYn, userNa:userNa}
        res.status(200).json({info:info, resultCode:"00"});
    }else{
        console.log("해당 기기는 자동 안됨")
        res.status(200).json({info:info, resultCode:"-1"});
    }
})

router.post("/v1/isIdDuplicate", async(req, res, next)=>{
    const {id} = req.body;
    const result = await execSql(isIdDuplicate,{userId:id})
    let isDuplicate = true;
    if(result.recordset[0].cnt === 0){
        isDuplicate = false
    }
    //const result = await execSql(login, {userId:id, passWord:passWord})
    res.json({status_code:"00", isDuplicate:isDuplicate}); 
})

router.post("/v1/saveUser", async(req, res, next)=>{
    const {hpNo, id, password, userName, ownrYn, mnrgYn, crewYn} = req.body;
    console.log(id, hpNo, password, userName);
    const result = await execSql(saveUser, {userId:id, passWord:password, hpNo:hpNo, userName:userName, ownrYn:ownrYn, mnrgYn:mnrgYn,crewYn:crewYn})
    const resultObj = {status_code:"00", result:true};
    if(result.rowsAffected[0] == 0){
        resultObj.result = false;
    }
    res.json(resultObj); 
})

router.get("/v1/getStoreList", async (req, res, next) => {
    const {userId} = req.query;
    const result = await execSql(getStoreList, {userId:userId})
    console.log(result.recordset);
    res.json({result:result.recordset, status_code:"00"});
})

router.get("/v1/getStoreListCrew", async (req, res, next) => {
    const {cstNa, userId} = req.query;
    const result = await execSql(getStoreListCrew, {cstNa:cstNa, userId:userId})
    console.log(result.recordset);
    res.json({result:result.recordset, status_code:"00"});
})


router.get("/v1/getLatLon", async (req, res, next) => {
    const {address, zoneCode} = req.query;
    const key = process.env.KAKAO_API
    let result = {resultCode:"-1", lat:null, lon:null}

    console.log(req)

    await axios.get("https://dapi.kakao.com/v2/local/search/address", {
        params: {
            query: address
        },
        headers:{
            "content-type":"application/json;charset=UTF-8",
            "Authorization": `KakaoAK ${key}`
        }
    })
    .then(function (response) {
        result = {
            resultCode:"00", 
            lat:response.data.documents[0].y, 
            lon:response.data.documents[0].x
        }
    }).catch(function (error) {
        // 오류발생시 실행
        console.log(error)
    }).then(function() {
        // 항상 실행
        //console.log("항상 실행")
    });
    res.json(result)
})

router.get("/v1/checkTaxNo", async (req, res, next) => {
    const {taxNo} = req.query;
    const key = process.env.TAXNO_API
    let result = {resultCode:"-1", result:""}

    await axios.post(`https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=${key}`, {
        "b_no": [
            taxNo
        ]
    })
    .then(function (response) {
        console.log(response.data.data[0])
        result.result = response.data.data[0]
    }).catch(function (error) {
        // 오류발생시 실행
        console.log(error)
    });
    res.json(result)
})

router.post("/v1/addStore", transactionMiddleware, async (req, res, next) => {
    let transaction; // 트랜잭션 객체 선언
    try {
        // req 객체에서 트랜잭션 가져오기
        transaction = req.transaction; // 트랜잭션 객체 초기화
        const request = transaction.request();

        //데이터 전처리
        const {lat, lon, address, zoneCode, taxNo, cstNa, detailAddress, userId, userNa} = req.body;
        let result = {resultCode:"-1", result:""}

        //const MCSTUSERresult = await execSql(insertMCSTUSER, {userId:userId})
        console.log({cstNa:cstNa, cstCl:"COFFE", taxNo:taxNo, zipNo:zoneCode, zipAddr:address, addr:detailAddress, lat:lat, lon:lon, userId:userId, repNa:userNa})
        const rlt = await execTranSql(request, insertMCST, {cstNa:cstNa, cstCl:"COFFE", taxNo:taxNo, zipNo:zoneCode, zipAddr:address, addr:detailAddress, lat:lat, lon:lon, userId:userId, repNa:userNa})
        console.log(rlt)
        console.log("########################################33")
        // SQL 쿼리 실행
        const cstCo = rlt.recordset[0].CSTCO;
        
        const rlt2 = await execTranSql(request, insertMCSTUSER, {cstCo:cstCo, userId:userId, iUserId:userId, roleCl:"ownr", rtCl:"N"})
        console.log(rlt2)

        // 트랜잭션 커밋

        await transaction.commit();
    
        res.status(200).json({ resultCode:"00", result:rlt.rowsAffected[0] + rlt2.rowsAffected[0] });
      } catch (error) {
        // 트랜잭션 롤백
        console.log(error)
        await transaction.rollback();
        res.status(200).json({ resultCode:"-1"});
      }
})


router.post("/v1/saveTaxNo", async (req, res, next) => {
    try {
        const {taxNo, cstCo, userId} = req.body;
        const result = await execSql(updateTaxNo, {cstCo:cstCo, taxNo:taxNo, userId:userId})
        res.status(200).json({ resultCode:"00", result:result.rowsAffected[0] });
      } catch (err) {
        console.log(err.message)
        res.status(200).json({ resultCode:"-1"});
      }
})

router.post("/v1/modifyStore", async (req, res, next) => {
    console.log("수정하기")
    try {
        const {cstNa, zoneCode, address, detailAddress, lat, lon, userId, cstCo} = req.body;
        let result = {resultCode:"-1", result:""}
    
        const rlt = await execSql(modifyStoreInfo, {cstNa:cstNa, zipNo:zoneCode, zipAddr:address, addr:detailAddress, lat:lat, lon:lon, lat:lat, userId:userId, cstCo,cstCo})
        res.status(200).json({ resultCode:"00", result:rlt.rowsAffected[0] });
      } catch (err) {
        console.log(err.message)
        res.status(200).json({ resultCode:"-1"});
      }
})

// 알바생 점포 지원
router.post("/v1/applyStoreListCrew", async (req, res, next) => {
    try{
        const {cstCo, userId, iUserId, roleCl} = req.body;
        const result = await execSql(insertMCSTUSER, {cstCo:cstCo, userId:userId, iUserId:iUserId, roleCl:roleCl, rtCl:"R"})
        console.log({result:result.recordset, resultCode:"00"})
        res.status(200).json({result:result.recordset, resultCode:"00"});
    } catch (err) {
        console.log(err.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.get("/v1/searchCrewList", async (req, res, next) => {
    try {
        const {userId} = req.query;
        const result = await execSql(searchCrewList, {userId:userId}) 
        res.status(200).json({result:result.recordset, resultCode:"00"});
    } catch (err) {
        console.log(err.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

// 다음 버전에서 지울 라우터
router.post("/v1/approvCrew", async (req, res, next)=>{
    try {
        const {cstCo, userId} = req.body;
        const result = await execSql(changeCrewRTCL, {userId:userId, cstCo:cstCo, rtCl:"N"}) 
        res.status(200).json({result:result.rowsAffected[0], resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.post("/v1/changeCrew", async (req, res, next)=>{
    try {
        const {cstCo, userId, rtCl} = req.body;
        const result = await execSql(changeCrewRTCL, {userId:userId, cstCo:cstCo, rtCl:rtCl}) 
        res.status(200).json({result:result.rowsAffected[0], resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.get("/v1/searchMyAlbaList", async (req, res, next) => {
    try {
        const {userId} = req.query;
        const result = await execSql(searchMyAlbaList, {userId:userId, execptRtcl:"Y"});
        res.status(200).json({result:result.recordset, resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.get("/v1/getSelStoreRecords", async (req, res, next) => {
    function getDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }
    try {
        const {userId, cstCo} = req.query;
        const params = {userId:userId, cstCo:cstCo}
        const ymd = getDate();
        const result = await execSql(jobChk, {...params, cls:"jobchksearch", ymd:ymd});
        const result2 = await execSql(jobChk, {...params, cls:"jobdaytotal", ymd:ymd});
        res.status(200).json({result:result.recordset, totalJobMin:result2.recordset[0].TotalJobMin, resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.post("/v1/insertJobChk", async (req,res,next)=>{
    console.log("insertJobChk")
    try {
        const {cstCo, userId, day, lat, lon, jobYn, apvYn} = req.body;
        const result = await execSql(insertJobChk, {userId:userId, cstCo:cstCo, day:day, lat:lat, lon:lon, jobYn:jobYn, apvYn:apvYn});
        console.log(result)
        res.status(200).json({result:result.recordset, resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.get("/v1/getTermsDetail", async(req, res, next)=>{
    try {
        const {termId} = req.query;
        const result = await execSql(getTermsDetail, { INFSHRCO:termId });
        res.status(200).json({result:result.recordset, resultCode:"00"});
    } catch (error) {
        console.error(error.message);
        res.status(200).json({ resultCode:"-1"});
    }
})

router.get("/v1/testLog", async (req, res, next) => {
    try {
        const {log} = req.query;
        console.log(log)
        res.status(200).json({result:"테스트끝", resultCode:"00"});
    } catch (error) {
        console.log(error.message)
        res.status(200).json({ resultCode:"-1"});
    }
})

router.get("/v1/checkStoreLocation", async (req, res, next) => {
    console.log("checkStoreLocation")

    const getCurrentTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const date = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
    };

    // 시간을 올림 또는 버림으로 맞춰주는 함수
    const getRoundedTime = (timeString, roundUp = true) => {
        const time = new Date(timeString);
        const minutes = time.getMinutes();
        const roundedMinutes = roundUp ? Math.ceil(minutes / 10) * 10 : Math.floor(minutes / 10) * 10;
        time.setMinutes(roundedMinutes);
        time.setSeconds(0);
        const offset = time.getTimezoneOffset() * 60 * 1000;
        const localTime = new Date(time.getTime() - offset);
        const localTimeString = localTime.toISOString().replace("T", " ").slice(0, -1);
        return localTimeString;
    };   
    const deg2rad = (deg) => {
        return deg * (Math.PI/180);
    }

    const distance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // 지구 반지름 (단위: km)
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // 두 지점 간의 거리 (단위: km)
        return distance * 1000;
    }
    
    const getDay = () => {
        const day = new Date().getDay();
        let result = ""
        switch (day) {
            case 1:
                result = "MON";
                break;
            case 2:
                result = "TUE";
                break;
            case 3:
                result = "WEN";
                break;
            case 4:
                result = "THR";
                break;
            case 5:
                result = "FRI";
                break;
            case 6:
                result = "SAT";
                break;
            case 0:
                result = "SUN";
                break;
            default:
                break;
        }
        return result
    }
    try {
        let resultCode = "00"
        const {id, uuid, lat, lon, ymd} = req.query;
        console.log("###TaskManager => "+id+"가 디바이스("+uuid+")로 출퇴근 체크중")
        let apvYn = "N";
        const curday = getDay();
        const {recordset:uuidInfo} = await execSql(getUUID, {userId:id});
        console.log(uuidInfo[0].UUID)
        if(uuidInfo[0].UUID === uuid){
            const {recordset:jobChk} = await execSql(checkJobChk, {userId:id});    
            const {recordset:myAlbaList} = await execSql(searchMyAlbaList, {userId:id});
            if(jobChk[0] && jobChk[0].JOBYN == "Y") { 
                const cstCo = jobChk[0].CSTCO;
                const alba = myAlbaList.filter((alba) => { return alba.CSTCO === cstCo })
                const meter = distance(lat, lon, alba[0].LAT, alba[0].LON)
                if(meter > 50){
                    const result = await execSql(insertJobChk, {userId:id, cstCo:cstCo, day:curday, lat:Math.floor(lat), lon:Math.floor(lon), jobYn:"N", apvYn:apvYn, chkTime:ymd});
                    console.log(id+"가 퇴근을 완료함"+cstCo)
                }
            }else{
                for (const alba of myAlbaList) {
                    if (alba.RTCL === "N") {
                        const meter = distance(lat, lon, alba.LAT, alba.LON)
                        if(meter < 50){
                            const result = await execSql(insertJobChk, {userId:id, cstCo:alba.CSTCO, day:curday, lat:Math.floor(lat), lon:Math.floor(lon), jobYn:"Y", apvYn:apvYn, chkTime:ymd});
                            console.log(id+"가 출근을 완료함"+alba.CSTCO)
                            break;
                        }
                    }
                }
            }
            console.log(id+" 출퇴근 체크 종료");
        }else{
            console.log("해당 디바이스는 출퇴근 기록용이 아님");
            resultCode = "-2";
        }
        res.status(200).json({resultCode:resultCode});
    } catch (error) {
        console.log(error.message);
        res.status(200).json({ resultCode:"-1"});
    }

})

router.get("/v1/getMyStoreForSalary", async (req, res, next) => {

    const {userType, userId} = req.query
    var result;
    if(userType === "crew"){
        result = await execSql(searchMyAlbaList, {userId:userId, execptRtcl:""});
    }else if(userType === "owner"){
        //테스트안함.
        result = await execSql(getStoreList, {userId:userId})
    }
    
    console.log(result.recordset);

    res.status(200).json({resultCode:"00", storeList:result.recordset});
})

router.get("/v1/getSalary", async (req, res, next) => {
    const {userType, ymdFr, ymdTo, userId, cstCo} = req.query
    const cls = (userType === "crew")?"salary2":(userType === "owner")?"salary1":"";

    const result = await execSql(salary, {userId:userId, cls:cls, ymdFr:ymdFr, ymdTo:ymdTo, cstCo:cstCo});
    res.status(200).json({resultCode:"00", salary:result.recordset});
})

router.get("/v1/getSalaryDetail", async (req, res, next) => {
    const {ymdFr, ymdTo,  userId, cstCo} = req.query
    const result = await execSql(salary, {userId:userId, cls:"salaryDetail", ymdFr:ymdFr, ymdTo:ymdTo, cstCo:cstCo});
    const result3 = await execSql(salary, {userId:userId, cls:"salaryWeek", ymdFr:ymdFr, ymdTo:ymdTo, cstCo:cstCo});
    const result2 = await execSql(salary, {userId:userId, cls:"salaryTotal", ymdFr:ymdFr, ymdTo:ymdTo, cstCo:cstCo});

    res.status(200).json({resultCode:"00", salaryDetail:result.recordset, slalryWeek:result3.recordset, salaryTotal:result2.recordset[0]});
})


module.exports = router;

