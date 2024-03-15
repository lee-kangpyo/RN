const { Expo } = require('expo-server-sdk');


async function sendPush(tokens){
    // Create a new Expo SDK client
    // optionally providing an access token if you have enabled push security
    let expo = new Expo();

    // Create the messages that you want to send to clients
    let messages = [];
    for (let pushToken of tokens) {
        // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
        pushToken = `ExponentPushToken[${pushToken}]`
        // Check that all your push tokens appear to be valid Expo push tokens
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }

        // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
        messages.push({
            to: pushToken,
            sound: 'default',
            title:"알로하 테스트 푸시메시지",
            body: '안녕하세요 알로하 푸시 메시지입니다.',
            data: { withSome: 'data' },
        })
    }

    // The Expo push notification service accepts batches of notifications so
    // that you don't need to send 1000 requests to send 1000 notifications. We
    // recommend you batch your notifications to reduce the number of requests
    // and to compress them (notifications with similar content will get
    // compressed).
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (let chunk of chunks) {
        try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
        } catch (error) {
        console.error(error);
        }
    }
    })();
}


async function sendReqCommute(data){
    const tokens = Object.keys(data);
    let expo = new Expo();
    let messages = [];
    for (const token of tokens) {
        // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
        const pushToken = `ExponentPushToken[${token}]`
        // Check that all your push tokens appear to be valid Expo push tokens
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }
        console.log(data[token]);

        // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
        messages.push({
            to: pushToken,
            sound: 'default',
            body: '근무 변경 요청이 있습니다.',
            data: { type:"owner-badge", badge: data[token].cnt },
        })
    }

    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {
    
    for (let chunk of chunks) {
        try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
        } catch (error) {
        console.error(error);
        }
    }
    })();
}



async function checkTicket(tickets){
    let expo = new Expo();

    let receiptIds = [];
    for (let ticket of tickets) {
    // NOTE: Not all tickets have IDs; for example, tickets for notifications
    // that could not be enqueued will have error information and no receipt ID.
    if (ticket.id) {
        receiptIds.push(ticket.id);
    }
    }

    let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    (async () => {
    // Like sending notifications, there are different strategies you could use
    // to retrieve batches of receipts from the Expo service.
    for (let chunk of receiptIdChunks) {
        try {
        let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
        console.log(receipts);

        // The receipts specify whether Apple or Google successfully received the
        // notification and information about an error, if one occurred.
        for (let receiptId in receipts) {
            let { status, message, details } = receipts[receiptId];
            if (status === 'ok') {
            continue;
            } else if (status === 'error') {
            console.error(
                `There was an error sending a notification: ${message}`
            );
            if (details && details.error) {
                // The error codes are listed in the Expo documentation:
                // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
                // You must handle the errors appropriately.
                console.error(`The error code is ${details.error}`);
            }
            }
        }
        } catch (error) {
        console.error(error);
        }
    }
    })();
}


module.exports = {sendPush, checkTicket, sendReqCommute};
