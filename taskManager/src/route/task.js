const express = require('express')
var router = express.Router();
const {execSql, execTranSql} = require("../utils/excuteSql");

const { searchMyAlbaList, insertJobChk, checkJobChk, getUUID, MyuserTrace } = require('../query/taskManager'); 
const axios = require('axios');

const dotenv = require('dotenv');
const runMyQuery = require('../utils/MySqlQuery');
dotenv.config();

router.get("/checkStoreLocation", async (req, res, next) => {
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

        console.log("###TaskManager => "+id+"가 디바이스("+uuid+")로 출퇴근 체크중... 현재 위치 : "+lat+", "+lon)
        let apvYn = "N";
        const curday = getDay();
        const {recordset:uuidInfo} = await execSql(getUUID, {userId:id});
        //console.log(uuidInfo[0].UUID)

        if(uuidInfo[0].UUID === uuid){
            const {recordset:jobChk} = await execSql(checkJobChk, {userId:id});    
            const {recordset:myAlbaList} = await execSql(searchMyAlbaList, {userId:id});
            if(jobChk[0] && jobChk[0].JOBYN == "Y") { 
                console.log("퇴근 체크...")
                let jobYn = '';
                const cstCo = jobChk[0].CSTCO;
                const alba = myAlbaList.filter((alba) => { return alba.CSTCO === cstCo })
                const meter = distance(lat, lon, alba[0].LAT, alba[0].LON)
                if(meter > 50){
                    jobYn="N"
                    const result = await execSql(insertJobChk, {userId:id, cstCo:cstCo, day:curday, lat:lat, lon:lon, jobYn:jobYn, apvYn:apvYn, chkTime:ymd});
                    console.log(id+"가 퇴근을 완료함"+cstCo)
                }else{
                    console.log("아직 출근중...")
                }
                console.log("mysql")
                console.log(id, cstCo, jobYn, lat, lon, uuid);
                runMyQuery(MyuserTrace, [id, cstCo, jobYn, lat, lon, uuid])
            }else{
                console.log("출근체크...(내 알바 리스트)")
                let jobYn = '';
                let cstCo = null;
                for (const alba of myAlbaList) {
                    if (alba.RTCL === "N") {
                        const meter = distance(lat, lon, alba.LAT, alba.LON)
                        if(meter < 50){
                            jobYn = 'Y'
                            cstCo = alba.CSTCO;
                            const result = await execSql(insertJobChk, {userId:id, cstCo:cstCo, day:curday, lat:lat, lon:lon, jobYn:jobYn, apvYn:apvYn, chkTime:ymd});
                            console.log(id+"가 출근을 완료함"+alba.CSTCO)
                            break;
                        }
                    }
                }
                console.log("mysql")
                console.log(id, cstCo, jobYn, lat, lon, uuid);
                runMyQuery(MyuserTrace, [id, cstCo, jobYn, lat, lon, uuid])
                console.log("출근 체크 끝")
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


module.exports = router;

