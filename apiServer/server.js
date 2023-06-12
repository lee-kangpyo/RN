const express = require('express');
//const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const apiRouter = require("./src/route/api")

// body-parser 미들웨어 등록
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

app.listen(8080, function () {
  console.log('listening on 8080')
});

app.use(express.json());


app.use('/api', apiRouter);