const express = require('express');
const path = require('path');
const app = express();

const apiRouter = require("./src/route/api")
const pushRouter = require("./src/route/push");
const { sendBadge } = require('./src/utils/pushFunc');

app.listen(8080, function () {
  console.log('listening on 8080')
});

app.use(express.json());



// 주기적인 polling을 설정 (예: 5초마다)
const pollingInterval = 5000; // 5초
setInterval(sendBadge, pollingInterval);

app.use('/api', apiRouter);
app.use('/push', pushRouter);

