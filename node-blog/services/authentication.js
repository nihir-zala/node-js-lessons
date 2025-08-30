const JWT = require("jsonwebtoken");

const secret = "$superMan@123";

function generateTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.emali,
    fullName: user.fullName,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };

  const token = JWT.sign(payload, secret);

  return token;
}
function validateToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
}

module.exports = {
  generateTokenForUser,
  validateToken,
};
