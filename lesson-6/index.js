const fs = require('fs');
const http = require('http');
const url = require('url');

const port = 8000;

const server = http.createServer((req, res) => {
    const log = `${Date.now()}: ${req.url} New Req Recieved\n`;
    const myUrl = url.parse(req.url, true);
    console.log(myUrl);

    const username = myUrl.query.name;
    const userId = myUrl.query.id;
    const search = myUrl.query.search;
    fs.appendFile("../log.txt",log, (err, data) => {
        switch (myUrl.pathname) {
            case '/': 
                if(username !== undefined) {
                    res.end(`Hola, ${username}`);
                } else {
                    res.end(`Hola, Welcome To Home`);
                }
                break;
            case '/about-us': 
                res.end('Hello from the About Us');            
                break;
            case '/contact-us': 
                res.end('Contact Us');            
                break;
        
            default:
                res.end('404 not found.');
                break;
        }
    });
    console.log("New request recieved.");
});


server.listen(port,()=> console.log('Server started at: http://localhost:'+port));