const { Router } = require("express");
const {
  getSignup,
  postSignup,
  getSignIn,
  postSignIn,
  handleLogOut,
} = require("../controller/UserController");

const router = Router();

router.get("/signin", getSignIn);
router.post("/signin", postSignIn);

router.get("/signup", getSignup);
router.get("/logout", handleLogOut);
router.post("/signup", postSignup);

module.exports = router;
