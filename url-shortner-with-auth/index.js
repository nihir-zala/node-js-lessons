// index.js
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const { connectMongoDB } = require("./connect");
const urlRouter = require("./routes/url");
const userRouter = require("./routes/user");
const { restrictToLoggedInUserOnly } = require("./middlewares/auth");
const { getAllTheIds, urlRedirect } = require("./controllers/url");

const app = express();
const PORT = 8001;

// Connect MongoDB
connectMongoDB("mongodb://localhost:27017/url-shortner")
  .then(() => console.log("Mongo connected"))
  .catch((err) => console.error(err));

// View engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// User routes (signup/signin/logout)
app.use("/user", userRouter);

// Protect all /url routes with auth middleware
app.use("/url", restrictToLoggedInUserOnly, urlRouter);

// Index page - only logged in users
app.get("/", restrictToLoggedInUserOnly, getAllTheIds);

// Short URL redirect - public
app.get("/:shortId", urlRedirect);

app.listen(PORT, () => {
  console.log(`Server Started at: http://localhost:${PORT}`);
});
