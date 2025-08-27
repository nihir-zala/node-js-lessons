const fs = require('fs');
const http = require('http');
const port = 8000;
const server = http.createServer((req, res) => {
    const log = `${Date.now()}: ${req.url} New Req Recieved\n`;
    fs.appendFile("log.txt",log, (err, data) => {
        switch (req.url) {
            case '/': 
                res.end('Welcome to Home');            
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