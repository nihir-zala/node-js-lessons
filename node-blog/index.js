const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");
const setUserForViews = require("./middlewares/setUserForViews");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(setUserForViews);

const PORT = 8000;

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const Blog = require("./models/BlogModel");
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.get("/", async (req, res) => {
  const blogs = await Blog.find({})
    .sort({ createdAt: -1 }) // newest first
    .populate("createdBy", "fullName profileImageURL"); // select only needed fields

  res.render("index", {
    user: req.user,
    blogs,
  });
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
