const schedule = require('node-schedule');

const {execSql} = require("../utils/excuteSql");
const { getUser } = require('../query/testQuery');
const sendPushNotifications = require('../utils/sendPush');
const { searchSendTable, delSendTable, insertResultTable } = require('../query/basicQuery');
const parseJSON = require('../utils/json');
const { PR_PLYG01_MSGSEND, PR_JOB_CLOSE } = require('../query/jobQuery');

async function job () {
  const job = schedule.scheduleJob('50 23 * * *', async () => {
    try {
        console.log("dailyJob 실행")
        const date = new Date();
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const ymd = `${year}${month}${day}`;
        await execSql(PR_PLYG01_MSGSEND, {ymd})
        await execSql(PR_JOB_CLOSE, {ymdTo:ymd, ymdFr:ymd})
    } catch (error) {
      console.error('에러 발생:', error);
    }
  });

  return job;
}

module.exports = {
  job,
};


