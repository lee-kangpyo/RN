const { Expo } = require('expo-server-sdk');

// Expo 서버 SDK 초기화
const expo = new Expo();

// 푸시 알림을 보내는 함수 data를 담아서 앱에 전달가능. 생략도 가능.
// messages => [
//  { to: '푸시 알림을 수신할 사용자의 푸시 토큰', title: '알림 제목', body: '알림 내용', data:{"키":"값"} },
//  { to: '푸시 알림을 수신할 사용자의 푸시 토큰', title: '알림 제목', body: '알림 내용', data:{"키":"값"}  },
//];
async function sendPushNotifications(messages) {
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];

  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error('푸시 알림 전송 에러:', error);
    }
  }

  return tickets;
}

module.exports = sendPushNotifications;
