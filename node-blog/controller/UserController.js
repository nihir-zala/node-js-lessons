const User = require("../models/UserModel");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/nodejs-blogs");

async function postSignup(req, res) {
  const { fullName, email, password } = req.body;
  await User.create({ fullName, email, password });
  return res.redirect("/");
}

async function getSignup(req, res) {
  return res.render("signup");
}

async function getSignIn(req, res) {
  return res.render("signin");
}

async function postSignIn(req, res) {
  const { email, password } = req.body;

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    console.log("Logged in user:", token);

    return res.cookie("token", token).redirect("/");
  } catch (err) {
    console.error(err.message);
    return res.render("signin", {
      error: err.message,
    });
  }
}

function handleLogOut(req, res) {
  // Clear the cookie named "token"
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only over HTTPS in production
    sameSite: "lax",
  });

  // Redirect to home or signin page
  res.redirect("/");
}

async function updateProfile(req, res) {
  try {
    const { fullName } = req.body; // now this works

    if (!fullName || fullName.trim() === "") {
      return res.render("profile", {
        user: req.user,
        error: "Full name cannot be empty",
      });
    }

    await User.findByIdAndUpdate(req.user._id, { fullName: fullName.trim() });

    res.redirect("/user/profile");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error while updating profile.");
  }
}

async function editUserProfile(req, res) {
  try {
    const user = req.user; // logged-in user
    res.render("profile", { user, error: "" }); // pass error as empty string
  } catch (err) {
    console.error(err);
    res.render("profile", { user: req.user, error: "Something went wrong." });
  }
}

module.exports = {
  postSignup,
  getSignup,
  getSignIn,
  postSignIn,
  handleLogOut,
  editUserProfile,
  updateProfile,
};
