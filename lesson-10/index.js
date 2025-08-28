const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");
const { error } = require("console");
const app = express();
const port = 8000;

// middleware for the get the data from the post req.
app.use(express.urlencoded({ extended: false }));

// Routes

app.get("/api/users", (req, res) => {
  return res.json(users);
});

app.post("/api/users", (req, res) => {
  const body = req.body; // make sure added the middleware

  console.log(body);

  // This is the one method to write file
  // users.push({
  //     first_name: body.first_name,
  //     last_name: body.last_name,
  //     email: body.email,
  //     ip_address: body.ip_address,
  //     gender: body.gender,
  // });

  // This is the second method to store/write file but for this have to include the fs module.
  const newId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
  users.push({ ...body, id: newId });

  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to save user" });
    }
    return res.status(201).json({ status: "success", user: body });
  });
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = parseInt(req.params.id); // safer, ensures number
    const user = users.find((u) => u.id == id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  })
  .put((req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return res.status(404).json({ error: "User not found" });

    users[index] = { ...users[index], ...req.body };
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
      if (err) return res.status(500).json({ error: "Failed to update user" });
      res.json({ status: "success", user: users[index] });
    });
  })
  .delete((req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return res.status(404).json({ error: "User not found" });

    const deletedUser = users.splice(index, 1);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
      if (err) return res.status(500).json({ error: "Failed to delete user" });
      res.json({ status: "deleted", user: deletedUser[0] });
    });
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

app.listen(port, () =>
  console.log("Server started at: http://localhost:" + port)
);
