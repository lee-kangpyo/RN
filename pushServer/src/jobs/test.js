const schedule = require('node-schedule');

const {execSql} = require("../utils/excuteSql");
const { getUser } = require('../query/testQuery');
const sendPushNotifications = require('../utils/sendPush');
const { searchSendTable, delSendTable, insertResultTable } = require('../query/basicQuery');
const parseJSON = require('../utils/json');

// 기본 빼대
function basic() {
  // 매 시간마다 체크할 스케줄을 설정합니다.
  const job = schedule.scheduleJob('* * * * *', async () => {
    try {
        console.log("데이터 베이스 접속");
        const messages = [];
        const result = await execSql(getUser, {userId:"Sksksksk"});

        console.log("푸시 메시지 작성");
        for (user in result.recordset){
            messages.push({to:`ExponentPushToken[${result.recordset[0].TOKEN}]`, body:"알림 메시지", data:{"test":"test"}});
        }

        console.log(messages);
        sendPushNotifications(messages);
    } catch (error) {
      console.error('에러 발생:', error);
    }
  });

  return job;
}

async function test () {
  //const job = schedule.scheduleJob('* * * * *', async () => {
    try {
        //sendTable 체크 및 푸시 보낼 데이터 분리
        const messages = [];
        const result = await execSql(searchSendTable, {});
        const data = result.recordset;
        if(data.length > 0){
          const pushList = data.filter(el => el.STAT == '00');
          if(pushList.length > 0){
            //메시지 셋팅
            pushList.forEach(el => {
              const msg = {to:`ExponentPushToken[${el.TOKEN}]`, body:el.CONTENT};
              if(el.PARAM) msg.data = parseJSON(el.PARAM);
              messages.push(msg);
            });
            console.log(messages);
            sendPushNotifications(messages);
          }
          // 결과 insert, sendTable 삭제
          const MSGNOS = data.map(el => el.MSGNO);
          const delQuery = delSendTable + `(${MSGNOS.join(",")})`;
          const insertQuery = insertResultTable + `(${MSGNOS.join(",")})`;
          await execSql(insertQuery, {})
          await execSql(delQuery, {})
        }
    } catch (error) {
      console.error('에러 발생:', error);
    }
  //});

  //return job;
}

module.exports = {
  basic,
  test
};


