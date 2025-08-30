const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const {
  getSignup,
  postSignup,
  getSignIn,
  postSignIn,
  handleLogOut,
  updateProfile,
  editUserProfile,
} = require("../controller/UserController");

const upload = multer();

const router = Router();

router.get("/signin", getSignIn);
router.post("/signin", postSignIn);

router.get("/signup", getSignup);
router.get("/logout", handleLogOut);
router.post("/signup", postSignup);

router.get("/profile", editUserProfile);
router.post("/profile/update", upload.none(), updateProfile);

module.exports = router;
