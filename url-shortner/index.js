const express = require('express');
const urlRouter = require('./routes/url');
const {connectMongoDB} = require('./connect');
const { urlRedirect } = require('./controllers/url');
const app = express();
const PORT = 8001;

connectMongoDB('mongodb://localhost:27017/url-shortner')
.then(()=>console.log('Mongo connected') );

app.use(express.json());

app.use('/url',urlRouter);

app.get('/:shortId',urlRedirect);

app.listen(PORT, ()=> {
    console.log(`Server Started at: http://localhost:${PORT}`);
});