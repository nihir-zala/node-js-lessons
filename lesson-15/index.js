const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");
const mongoose = require("mongoose");
const { timeStamp } = require("console");

// connection

mongoose
  .connect("mongodb://localhost:27017/nodejs-tutorial")
  .then(() => console.log("Connected"))
  .catch((err) => console.log("Error:-", err));

// mongoose bydefaule work with schema so that created the users schema and decladre as a model
const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    jobTitle: { type: String, required: true },
    gender: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

const app = express();
const port = 8000;

// middleware for the get the data from the post req.
app.use(express.urlencoded({ extended: false }));

// Custom Middleware for the log
app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `${Date.now()}: ${req.ip}: ${req.method}: ${req.path} \n`,
    (err, data) => {
      next(); //pass to the next middleware
    }
  );
});

// Routes

app.get("/api/users", async (req, res) => {
  const allDBUsers = await User.find({});
  return res.json(allDBUsers);
});

app.post("/api/users", async (req, res) => {
  const body = req.body;
  const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });

  console.log(result);
  return res.status(201).json({ msg: "success" });
});

app
  .route("/api/users/:id")
  .get(async (req, res) => {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  })
  .patch( async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, {
      lastName: 'Changed',
    });

    return res.json({status:"success"});
  })
  .delete(async (req, res) => {
    await User.findByIdAndDelete(req.params.id);

    return res.json({status:"success"});
  });

app.listen(port, () =>
  console.log("Server started at: http://localhost:" + port)
);
