const express = require('express');
const schedule = require('node-schedule');
const { test } = require('./src/jobs/test');
const { main } = require('./src/jobs/main');
const { job } = require('./src/jobs/job');

require('dotenv').config();

const app = express();

//const mainJob = test();
// 스케줄링된 작업을 시작합니다.
const mainJob = main();
const job = job();

// 서버를 실행합니다.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`푸시 서버가 http://localhost:${PORT} 에서 실행되고 있습니다.`);
});
