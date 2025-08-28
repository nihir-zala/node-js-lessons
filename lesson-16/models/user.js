const mongoose = require("mongoose");

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

module.exports = {
    User
};
