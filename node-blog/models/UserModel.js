const { createHmac, randomBytes } = require("node:crypto");
const { Schema, model } = require("mongoose");
const { generateTokenForUser } = require("../services/authentication");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "./images/default-avatar.jpg",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("validate", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = randomBytes(16).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  user.salt = salt;
  user.password = hashedPassword;

  next();
});

// Instance method to validate password
userSchema.methods.validatePassword = function (password) {
  const hashedPassword = createHmac("sha256", this.salt)
    .update(password)
    .digest("hex");

  return this.password === hashedPassword;
};

// Static method for login
userSchema.statics.matchPasswordAndGenerateToken = async function (
  email,
  password
) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User not found.");

  const isMatch = user.validatePassword(password);
  if (!isMatch) throw new Error("Password is wrong.");

  // return user object without sensitive data
  const userObj = user.toObject();
  const token = generateTokenForUser(userObj);
  return token;
};

const User = model("user", userSchema);

module.exports = User;
