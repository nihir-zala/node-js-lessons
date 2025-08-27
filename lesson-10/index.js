const express = require('express');
const users = require('./MOCK_DATA.json');
const app = express();
const port = 8000;


// Routes

app.get('/api/users',(req, res)=>{
    return res.json(users);
});

app.route('/api/users/:id').
get((req, res)=>{
    const id = req.params.id;
    const user = users.find(user => user.id == id);
    return res.json(user);
})
.put((req, res) => {
    return res.json({status: "Pending"});
})
.delete((req, res) => {
    return res.json({status: "Pending"});
});




// app.post('/api/users',(req, res) => {
//     // TODO create the new user task
//     return res.json({status: "Pending"});
// });

// app.patch('/api/users/:id',(req, res) => {
//     // TODO create the new user task
//     return res.json({status: "Pending"});
// });

// app.delete('/api/users/:id',(req, res) => {
//     // TODO create the new user task
//     return res.json({status: "Pending"});
// });

app.listen(port,()=> console.log('Server started at: http://localhost:'+port));