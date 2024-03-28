const { getTemplatePushMessage, getTriggerInfo, getCstOwnrInfo, pushMsgSend, commuteInfo } = require("../query/push");
const { execSql, execSqlNoLog } = require("./excuteSql");
const { sendReqCommute } = require("./expoPush");

const sendPush_A0110_01 = async (cstCo, userId) => {
    const msgId = 'A0110_01';
    //템플릿 메시지 가져오기
    const templateMsg = await execSql(getTemplatePushMessage, {msgId});
    // 알바(보내는 사람) 정보 가져오기
    const trigger = await execSql(getTriggerInfo, {userId:userId});
    // 점주(받는 사람) 가져오기
    const cstOwnr = await execSql(getCstOwnrInfo, {cstCo:cstCo});
    const template = templateMsg.recordset[0];
    const sender = trigger.recordset[0];
    const receiver = cstOwnr.recordset[0];
    const msg = template.CONTENT.replace('{userNa}', sender.USERNA).replace("{cstNa}", receiver.CSTNA);
    const params = {cstCo, sendId:sender.USERID, reciveId:receiver.USERID, msgId, content:msg, link:template.LINK};
    await execSql(pushMsgSend, params);
}

const sendPush_A0130_01 = async (cstCo, userId, statNa) => {
    try {
        const msgId = 'A0130_01';
        //템플릿 메시지 가져오기
        const templateMsg = await execSql(getTemplatePushMessage, {msgId});
        // 알바 (받는 사람) 정보 가져오기
        const trigger = await execSql(getTriggerInfo, {userId:userId});
        // 점주 (보내는 사람) 가져오기
        const cstOwnr = await execSql(getCstOwnrInfo, {cstCo:cstCo});
        const template = templateMsg.recordset[0];
        const sender = cstOwnr.recordset[0];
        const receiver = trigger.recordset[0];
        const msg = template.CONTENT.replace('{userNa}', receiver.USERNA).replace("{cstNa}", sender.CSTNA).replace("{statNa}", statNa);
        const params = {cstCo, sendId:sender.USERID, reciveId:receiver.USERID, msgId, content:msg, link:template.LINK};
        //console.log(params);
        await execSql(pushMsgSend, params);
    } catch (error) {
        console.error(error);   
    }
    
}

const sendPush_A0220_01 = async (cstCo, userId) => {
    try {
        const msgId = 'A0220_01';
        //템플릿 메시지 가져오기
        const templateMsg = await execSql(getTemplatePushMessage, {msgId});
        // 알바 (받는 사람) 정보 가져오기
        const trigger = await execSql(getTriggerInfo, {userId:userId});
        // 점주 (보내는 사람) 가져오기
        const cstOwnr = await execSql(getCstOwnrInfo, {cstCo:cstCo});
        const template = templateMsg.recordset[0];
        const sender = cstOwnr.recordset[0];
        const receiver = trigger.recordset[0];
        const msg = template.CONTENT.replace("{cstNa}", sender.CSTNA);
        const params = {cstCo, sendId:sender.USERID, reciveId:receiver.USERID, msgId, content:msg, link:template.LINK};
        await execSql(pushMsgSend, params);
    } catch (error) {
        console.error(error);
    }
}

// ########################## 출퇴근 함수들 시작 ##########################
// 출퇴근 체크
// console.log("I 구간:", checkTimeSegment("2024-03-27T06:00:00", "2024-03-27T07:00:00", "2024-03-27T12:00:00", "I"));
// console.log("I 구간:", checkTimeSegment("2024-03-27T06:30:00", "2024-03-27T07:00:00", "2024-03-27T12:00:00", "I"));
// console.log("I 구간:", checkTimeSegment("2024-03-27T06:50:00", "2024-03-27T07:00:00", "2024-03-27T12:00:00", "I"));
// console.log("I 구간:", checkTimeSegment("2024-03-27T07:00:00", "2024-03-27T07:00:00", "2024-03-27T12:00:00", "I"));
// console.log("I 구간:", checkTimeSegment("2024-03-27T08:00:00", "2024-03-27T07:00:00", "2024-03-27T12:00:00", "I"));
// console.log("I 구간:", checkTimeSegment("2024-03-27T12:00:00", "2024-03-27T07:00:00", "2024-03-27T12:00:00", "I"));
// console.log("I 구간:", checkTimeSegment("2024-03-27T12:01:00", "2024-03-27T07:00:00", "2024-03-27T12:00:00", "I"));
// console.log("X 구간:", checkTimeSegment("2024-03-27T06:00:00", "2024-03-27T07:00:00", "2024-03-27T12:00:00", "X"));
// console.log("X 구간:", checkTimeSegment("2024-03-27T06:30:00", "2024-03-27T07:00:00", "2024-03-27T12:00:00", "X"));
// console.log("X 구간:", checkTimeSegment("2024-03-27T06:50:00", "2024-03-27T07:00:00", "2024-03-27T12:00:00", "X"));
// console.log("X 구간:", checkTimeSegment("2024-03-27T07:00:00", "2024-03-27T07:00:00", "2024-03-27T12:00:00", "X"));
// console.log("X 구간:", checkTimeSegment("2024-03-27T12:00:00", "2024-03-27T07:00:00", "2024-03-27T12:00:00", "X"));
// console.log("X 구간:", checkTimeSegment("2024-03-27T12:01:00", "2024-03-27T07:00:00", "2024-03-27T12:00:00", "X"));
// console.log("X 구간:", checkTimeSegment("2024-03-27T12:30:00", "2024-03-27T07:00:00", "2024-03-27T12:00:00", "X"));
// console.log("X 구간:", checkTimeSegment("2024-03-27T12:31:00", "2024-03-27T07:00:00", "2024-03-27T12:00:00", "X"));
function checkTimeSegment(checkTime, scheduleStartTime, scheduleEndTime, cls) {
    // Date 객체로 변환
    var checkDateTime = new Date(checkTime);
    var scheduleStartDateTime = new Date(scheduleStartTime);
    var scheduleEndDateTime = new Date(scheduleEndTime);

    // I인 경우
    if (cls === 'I') {
        // 30분 전인지 확인
        var thirtyMinutesBefore = new Date(scheduleStartDateTime);
        thirtyMinutesBefore.setMinutes(thirtyMinutesBefore.getMinutes() - 30);

        // 구간을 판단하여 반환
        if (checkDateTime >= thirtyMinutesBefore && checkDateTime <= scheduleStartDateTime) {
            return "01";
        } else if (checkDateTime >= scheduleStartDateTime && checkDateTime <= scheduleEndDateTime) {
            return "02";
        } else {
            return "03";
        }
    }
    // X인 경우
    else if (cls === 'X') {
        // 스케줄 스타트 타임과 스케줄 엔드 타임 사이인지 확인
        if (checkDateTime >= scheduleStartDateTime && checkDateTime < scheduleEndDateTime) {
            return "04";
        } 
        // 엔드 타임부터 30분 후인지 확인
        else if (checkDateTime >= scheduleEndDateTime && checkDateTime <= new Date(scheduleEndDateTime.getTime() + 30 * 60 * 1000)) {
            return "05";
        } 
        // 그 외의 경우
        else {
            return "06";
        }
    }
    // 그 외의 경우
    else {
        return "Unknown";
    }
}
const formatDate = (data) => {
    if (!data || typeof data !== 'object' || !(data instanceof Date)) return '';
    var dateString = data.toISOString(); 
    var date = new Date(dateString.replace("Z", ""));
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // 월은 0부터 시작하므로 1을 더합니다.
    var day = ("0" + date.getDate()).slice(-2);
    var hours = ("0" + date.getHours()).slice(-2);
    var minutes = ("0" + date.getMinutes()).slice(-2);
    var formattedDateTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes;
    return formattedDateTime;
}
const getCommuteInfo = async (cstCo, userId) => {
    const rlt = await execSql(commuteInfo, {cstCo, userId});
    const info = rlt.recordset[0];
    return info;
}


//출근
const crew = {"02":{msgId:"C0110_13"}, "04":{msgId:"C0110_23"}}
const ownr = {
    "01":{msgId:"C0120_11"}, 
    "02":{msgId:"C0120_13"}, 
    '03':{msgId:"Z0110_01", msg:"{userNa}님이 {cstNa}에 출근 하였습니다 : {chkTime}"}, 
    "04":{msgId:"C0120_23"}, 
    "05":{msgId:"C0120_21"}, 
    "06":{msgId:"Z0110_01", msg:"{userNa}님이 {cstNa}에 퇴근 하였습니다 : {chkTime}"}};

// crew, ownr 오브젝트를 이용해 타입에 따른 각각의 crew, ownr msgId 가 담긴 object를 리턴
const getMessageId = (type) => {
    const crewTemplate = crew[type];
    const ownrTemplate = ownr[type];
    return {ownr:ownrTemplate, crew:crewTemplate}
}
const getMessageTemplate = async (msgId) => {
    const templateMsg = await execSql(getTemplatePushMessage, {msgId});
    return templateMsg.recordset[0];
}
const insertSql = async (params) => {
    //console.log(params);
    await execSql(pushMsgSend, params);
}
// ########################## 출퇴근 함수들 끝 ##########################
const sendPush_GoToWork = async (cstCo, userId) => {
    console.log("출근 푸시알림 시작 ::::::::::::::::::::::::::::> sendPush_GoToWork");
    try {
        var msg = "", link = "";
        const info = await getCommuteInfo(cstCo, userId);
        if(info.schStartTime == null || info.schEndTime == null){ // 스케줄된 시작, 종료 시간이 둘중 하나라도 없으면 - 스케줄 없음
            // 점주에게 일반 출근 메시지 보내기
            const {ownr} = getMessageId("03");
            const chkTime = formatDate(info.chkStartTime);
            msg = ownr.msg.replace("{cstNa}", info.CSTNA).replace("{userNa}", info.USERNA).replace("{chkTime}", chkTime);
            insertSql({cstCo, sendId:userId, reciveId:info.receiveId, msgId:ownr.msgId, content:msg, link});
        }else{ // 스케줄 시작, 종료 시간 있음
            //체크 시간과 계획된 시작 시간, 종료 시간을 가지고 몇번 타입인지 리턴 
            const chkTime = formatDate(info.chkStartTime);
            const schStartTime = formatDate(info.schStartTime);
            const schEndTime = formatDate(info.schEndTime);
            // 01 정시 출근, 02 지각 출근, 03 일반 출근, 04 조기 퇴근, 05 정시 퇴근, 06 일반 퇴근
            const type = checkTimeSegment(chkTime, schStartTime, schEndTime, "I");
            // 해당 타입으로 crew, ownr msgId가 담긴 object 가져오기
            const {crew, ownr} = getMessageId(type);
            if(type == "03"){
                const chkTime = formatDate(info.chkStartTime);
                msg = ownr.msg.replace("{cstNa}", info.CSTNA).replace("{userNa}", info.USERNA).replace("{chkTime}", chkTime);
                insertSql({cstCo, sendId:userId, reciveId:info.receiveId, msgId:ownr.msgId, content:msg, link});
            }else{
                if(crew){
                    const templateMsg = await getMessageTemplate(crew.msgId);
                    msg = templateMsg.CONTENT.replace("{cstNa}", info.CSTNA).replace("{chkTime}", chkTime).replace("{schStartTime}", schStartTime);
                    insertSql({cstCo, sendId:info.receiveId, reciveId:userId, msgId:templateMsg.MSGID, content:msg, link: templateMsg.LINK});
                }
                if(ownr){
                    const templateMsg2 = await getMessageTemplate(ownr.msgId);
                    msg = templateMsg2.CONTENT.replace("{userNa}", info.USERNA).replace("{cstNa}", info.CSTNA).replace("{chkTime}", chkTime).replace("{schStartTime}", schStartTime);
                    insertSql({cstCo, sendId:userId, reciveId:info.receiveId, msgId:templateMsg2.MSGID, content:msg, link: templateMsg2.LINK});
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
}
// 퇴근
const sendPush_GetOffWork = async (cstCo, userId) => {
    console.log("퇴근 푸시알림 시작 ::::::::::::::::::::::::::::> sendPush_GoToWork")
    try {
        var msg = "", link = "";
        const info = await getCommuteInfo(cstCo, userId);
        if(info.schStartTime == null || info.schEndTime == null){
            const {ownr} = getMessageId("06");
            const chkTime = formatDate(info.chkStartTime);
            msg = ownr.msg.replace("{cstNa}", info.CSTNA).replace("{userNa}", info.USERNA).replace("{chkTime}", chkTime);
            insertSql({cstCo, sendId:userId, reciveId:info.receiveId, msgId:ownr.msgId, content:msg, link});
        }else{
            //체크 시간과 계획된 시작 시간, 종료 시간을 가지고 몇번 타입인지 리턴 
            const chkTime = formatDate(info.chkStartTime);
            const schStartTime = formatDate(info.schStartTime);
            const schEndTime = formatDate(info.schEndTime);
            // 01 정시 출근, 02 지각 출근, 03 일반 출근, 04 조기 퇴근, 05 정시 퇴근, 06 일반 퇴근
            const type = checkTimeSegment(chkTime, schStartTime, schEndTime, "X");
            // 해당 타입으로 crew, ownr msgId가 담긴 object 가져오기
            const {crew, ownr} = getMessageId(type);
            if(type == "06"){
                const chkTime = formatDate(info.chkStartTime);
                msg = ownr.msg.replace("{cstNa}", info.CSTNA).replace("{userNa}", info.USERNA).replace("{chkTime}", chkTime);
                insertSql({cstCo, sendId:userId, reciveId:info.receiveId, msgId:ownr.msgId, content:msg, link});
            }else{
                if(crew){
                    const templateMsg = await getMessageTemplate(crew.msgId);
                    msg = templateMsg.CONTENT.replace("{cstNa}", info.CSTNA).replace("{chkTime}", chkTime).replace("{schEndTime}", schEndTime);
                    insertSql({cstCo, sendId:info.receiveId, reciveId:userId, msgId:templateMsg.MSGID, content:msg, link: templateMsg.LINK});
                }
                if(ownr){
                    const templateMsg2 = await getMessageTemplate(ownr.msgId);
                    msg = templateMsg2.CONTENT.replace("{userNa}", info.USERNA).replace("{cstNa}", info.CSTNA).replace("{chkTime}", chkTime).replace("{schEndTime}", schEndTime);
                    insertSql({cstCo, sendId:userId, reciveId:info.receiveId, msgId:templateMsg2.MSGID, content:msg, link: templateMsg2.LINK});
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
}


module.exports = {
    sendPush_A0110_01,
    sendPush_A0130_01,
    sendPush_A0220_01,
    sendPush_GoToWork,
    sendPush_GetOffWork
};
  