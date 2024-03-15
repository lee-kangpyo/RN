const schedule = require('node-schedule');

const {execSql} = require("../utils/excuteSql");
const { getUser } = require('../query/testQuery');
const sendPushNotifications = require('../utils/sendPush');
const { searchSendTable, delSendTable, insertResultTable } = require('../query/basicQuery');
const parseJSON = require('../utils/json');

async function main () {
  const job = schedule.scheduleJob('* * * * *', async () => {
    try {
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
  });

  return job;
}

module.exports = {
    main,
};


