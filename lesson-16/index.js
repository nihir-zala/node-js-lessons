const express = require("express");
const {connectMongoDb} = require('./connection');
const userRouter = require('./routes/user');
const {logReqRes} = require('./middlwares/index');

connectMongoDb('mongodb://localhost:27017/nodejs-tutorial');

const app = express();
const port = 8000;

// middleware for the get the data from the post req.
app.use(express.urlencoded({ extended: false }));
app.use(logReqRes('log.txt'));
app.use('/api/user',userRouter);
app.listen(port, () =>
  console.log("Server started at: http://localhost:" + port)
);
