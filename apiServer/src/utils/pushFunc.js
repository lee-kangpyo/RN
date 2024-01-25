const { execSql, execSqlNoLog } = require("./excuteSql");
const { sendReqCommute } = require("./expoPush");


function testTask() {
  console.log('주기적인 작업을 수행합니다.');
  // 여기에 실제로 수행해야 할 작업을 추가합니다.
  // 여기서 /push/send 호출 등의 작업을 추가할 수 있습니다.
}

const getday = ()=> {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // 월은 0부터 시작하므로 1을 더합니다.
  // 이번달의 첫 번째 날
  const firstDay = `${year}${month.toString().padStart(2, '0')}01`;
  // 이번달의 마지막 날
  const lastDayOfMonth = new Date(year, month, 0);
  const lastDay = `${year}${month.toString().padStart(2, '0')}${lastDayOfMonth.getDate()}`;
  return {firstDay, lastDay};

}

const checkcommuteChange = `
select u.USERID ownerId, u.TOKEN, c.CSTCO ownerCstCo, d.CSTNA, a.*
from PLYADAYJOBREQ a
inner join PLYADAYJOB b ON a.JOBNO = b.JOBNO
inner join PLYMCSTUSER c ON a.CSTCO = c.CSTCO 
inner join PLYMCST d On c.CSTCO = d.CSTCO
inner join PLYMUSER u On c.USERID = u.USERID
WHERE a.USEYN = 'Y'
and a.REQSTAT = 'R'
and a.PUSHYN = 'N'
and b.APVYN != 'D'
and d.USEYN = 'Y'
AND c.ROLECL = 'ownr'
and u.TOKEN != ''
and u.TOKEN is not null
`

  
async function sendBadge() {
  const dayObj = getday();
  const query =  checkcommuteChange + `AND a.YMD BETWEEN ${dayObj.firstDay} AND ${dayObj.lastDay}`
  const result = await execSqlNoLog(query, {});
  if(result){
    const pushList = result.recordset;
    if(pushList.length > 0){
      console.log("근무 요청 기록이 있음.")
      const pushNoSet = new Set()
      const structured = pushList.reduce((accumulator, next) => {
        const token = next.TOKEN;
        if (token) {
          if (!accumulator[token]) {
            //accumulator[token] = { cnt: 0, data: [] };
            accumulator[token] = { cnt: 0 };
          }
          accumulator[token].cnt += 1;
          //accumulator[token].data.push(next);
          pushNoSet.add(next.REQNO);
        }
        return accumulator;
      }, {});
      console.log(structured)
      sendReqCommute(structured);
      
      const pushNoList = [...pushNoSet]
      
      if(pushNoList.length > 0){
        const closeCommuteChange = `
            UPDATE PLYADAYJOBREQ SET PUSHYN = 'Y'
            WHERE REQNO IN (${pushNoList.join(', ')})
        `
  
        await execSqlNoLog(closeCommuteChange, {});
      }
    }
  }
  
  //console.log(structured);
  // 여기에 실제로 수행해야 할 다른 작업을 추가합니다.
  // 여기서 /push/send 호출 등의 작업을 추가할 수 있습니다.
  // 
}

module.exports = {
  testTask,
  sendBadge,
};
  