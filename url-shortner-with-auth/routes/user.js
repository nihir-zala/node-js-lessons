const express = require("express");
const router = express.Router();
const {
  handleUserSignUpIndex,
  handleUserSignUp,
  handleUserSignInIndex,
  handleUserSignIn,
  handleUserSignOut,
} = require("../controllers/user");

router.get("/signup", handleUserSignUpIndex);
router.post("/signup", handleUserSignUp);

router.get("/signin", handleUserSignInIndex);
router.post("/signin", handleUserSignIn);

router.get("/logout", handleUserSignOut);

module.exports = router;
