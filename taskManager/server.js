const express = require('express');

const path = require('path');
const app = express();

const taskRouter = require("./src/route/task")
const adminRouter = require("./src/route/admin")

app.listen(5213, function () {
  console.log('listening on 5213')
});

app.use(express.json());

app.use('/api/v1/task', taskRouter);
app.use('/api/v1/admin', adminRouter);





