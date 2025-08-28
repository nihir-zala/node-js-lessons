const express = require("express");
const router = express.Router();
const {
  handleGetAllUsers,
  getUserById,
  storeUser,
  updateUserById,
  deleteUserById,
} = require("../controllers/user");

router.route("/").get(handleGetAllUsers).post(storeUser);

router
  .route("/:id")
  .get(getUserById)
  .patch(updateUserById)
  .delete(deleteUserById);

module.exports = router;
