const http = require('http');
const express = require('express');

const port = 8000;

const app = express();

app.get('/',(req, res) => {
    if(req.query.name !== undefined){
        res.send(`Welcome to the home page ${req.query.name}`);
    } else {
        res.send('welcome to the home page');
    }
});
app.get('/about',(req, res) => {
    res.send('About page');
});
app.get('/contact',(req, res) => {
    res.send('contact page');
});

app.listen(port,()=> console.log('Server started at: http://localhost:'+port));
