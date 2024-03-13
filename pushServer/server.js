const express = require('express');
const schedule = require('node-schedule');

require('dotenv').config();

const app = express();

const {execSql, execTranSql} = require("./src/utils/excuteSql");

// 매 시간마다 체크할 스케줄을 설정합니다.
const job = schedule.scheduleJob('* * * * *', async () => {
  try {
    // 디비에 접속하여 데이터를 가져오는 작업을 수행합니다.
    const data = await fetchDataFromDatabase();

    // 가져온 데이터를 기반으로 푸시 알림을 보내는 작업을 수행합니다.
    sendPushNotification(data);
  } catch (error) {
    console.error('에러 발생:', error);
  }
});

// 디비에서 데이터를 가져오는 비동기 함수입니다. 실제로는 여기에 디비 접속 및 쿼리 로직이 들어갑니다.
async function fetchDataFromDatabase() {
  // 여기에 실제 디비에서 데이터를 가져오는 로직을 작성합니다.
  // 예를 들어, MongoDB를 사용한다면 mongoose를 사용하여 쿼리를 작성할 수 있습니다.
  // 혹은 MySQL, PostgreSQL 등을 사용한다면 해당 라이브러리를 사용하여 쿼리를 작성할 수 있습니다.

  // 여기에서는 가짜 데이터를 반환합니다.
  return [
    { id: 1, title: '알림 1', message: '이벤트가 시작됩니다!' },
    { id: 2, title: '알림 2', message: '최신 소식을 확인하세요!' }
  ];
}

// 푸시 알림을 보내는 비동기 함수입니다. 실제로는 여기에 Expo API를 호출하여 푸시 알림을 보냅니다.
async function sendPushNotification(data) {
  // 여기에서는 간단하게 콘솔에 출력합니다.
  console.log('푸시 알림을 보냅니다:', data);

  // 실제로는 여기에서 Expo API를 호출하여 푸시 알림을 보냅니다.
  // axios 또는 fetch 등을 사용하여 Expo API를 호출할 수 있습니다.
  // Expo API 호출 예제: https://docs.expo.dev/push-notifications/sending-notifications/#sending-a-push-notification
}

// 서버를 실행합니다.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`푸시 서버가 http://localhost:${PORT} 에서 실행되고 있습니다.`);
});
