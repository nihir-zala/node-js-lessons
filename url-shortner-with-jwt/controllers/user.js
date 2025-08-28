const { User } = require("../models/user");
const { setUser } = require("../services/auth");
const { v4: uuidv4 } = require("uuid");

// Signup Page
async function handleUserSignUpIndex(req, res) {
  res.render("signup", { error: "", user: req.user || null });
}

// Signup POST
async function handleUserSignUp(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.render("signup", {
        error: "All fields are required.",
        user: null,
      });
    }

    const existing = await User.findOne({ email });
    if (existing)
      return res.render("signup", {
        error: "Email already registered.",
        user: null,
      });

    const user = await User.create({ name, email, password });

    // Generate JWT token
    const token = setUser(user);
    res.cookie("uid", token, { httpOnly: true });

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.render("signup", { error: "Server error.", user: null });
  }
}

// Signin Page
async function handleUserSignInIndex(req, res) {
  res.render("signin", { error: "", user: req.user || null });
}

// Signin POST
async function handleUserSignIn(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user)
      return res.render("signin", {
        error: "Invalid email or password.",
        user: null,
      });

    // Generate JWT token
    const token = setUser(user);
    res.cookie("uid", token, { httpOnly: true });

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.render("signin", { error: "Server error.", user: null });
  }
}

// Logout
function handleUserSignOut(req, res) {
  const uid = req.cookies?.uid;
  if (uid) res.clearCookie("uid");
  res.redirect("/user/signin");
}

module.exports = {
  handleUserSignUpIndex,
  handleUserSignUp,
  handleUserSignInIndex,
  handleUserSignIn,
  handleUserSignOut,
};
