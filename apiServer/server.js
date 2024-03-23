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

app.get("/", async (req, res, next)=>{
  console.log("GET test");
  try {
      res.status(200).json({result:"00", resultCode:"00"});
  } catch (error) {
      console.log(error.message)
      res.status(200).json({ resultCode:"-1"});
  }
})

app.use('/api', apiRouter);
app.use('/push', pushRouter);

