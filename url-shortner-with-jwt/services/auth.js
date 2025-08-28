const jwt = require("jsonwebtoken");
const secretkey = "super@secret";

// Generate JWT token for a user
function setUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    name: user.name,
  };
  return jwt.sign(payload, secretkey, { expiresIn: "1h" }); // expires in 1 hour
}

// Get user from token
function gettUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, secretkey);
  } catch (error) {
    return null;
  }
}

module.exports = { setUser, gettUser };
