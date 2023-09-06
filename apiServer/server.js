const express = require('express');
const path = require('path');
const app = express();

const apiRouter = require("./src/route/api")
const pushRouter = require("./src/route/push")

app.listen(8080, function () {
  console.log('listening on 8080')
});

app.use(express.json());

app.use('/api', apiRouter);
app.use('/push', pushRouter);

