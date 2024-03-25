const { getTemplatePushMessage, getTriggerInfo, getCstOwnrInfo, pushMsgSend } = require("../query/push");
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
    console.log(params);
    await execSql(pushMsgSend, params);
}

const sendPush_A0220_01 = async (cstCo, userId) => {
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
    console.log(params);
    await execSql(pushMsgSend, params);
}



module.exports = {
    sendPush_A0110_01,
    sendPush_A0130_01,
    sendPush_A0220_01
};
  