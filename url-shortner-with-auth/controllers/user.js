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
      return res.render("signup", { error: "All fields are required." });
    }

    const existing = await User.findOne({ email });
    if (existing)
      return res.render("signup", { error: "Email already registered." });

    const user = await User.create({ name, email, password });

    const uid = uuidv4();
    setUser(uid, user);
    res.cookie("uid", uid, { httpOnly: true });

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.render("signup", { error: "Server error." });
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
      return res.render("signin", { error: "Invalid email or password." });

    const uid = uuidv4();
    setUser(uid, user);
    res.cookie("uid", uid, { httpOnly: true });

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.render("signin", { error: "Server error." });
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
