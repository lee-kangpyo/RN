const { getTemplatePushMessage, getSenderInfo, getCstOwnrInfo, pushMsgSend } = require("../query/push");
const { execSql, execSqlNoLog } = require("./excuteSql");
const { sendReqCommute } = require("./expoPush");

const sendPush_A0110_01 = async (cstCo, userId) => {
    const msgId = 'A0110_01';
    const push = await execSql(getTemplatePushMessage, {msgId});
    const push2 = await execSql(getSenderInfo, {userId:userId});
    const push3 = await execSql(getCstOwnrInfo, {cstCo:cstCo});
    const template = push.recordset[0];
    const sender = push2.recordset[0];
    const receiver = push3.recordset[0];
    const msg = template.CONTENT.replace('{userNa}', sender.USERNA).replace("{cstNa}", receiver.CSTNA);
    const params = {cstCo, sendId:userId, reciveId:receiver.USERID, msgId, content:msg, link:template.LINK};
    await execSql(pushMsgSend, params);
}

module.exports = {
    sendPush_A0110_01,
};
  