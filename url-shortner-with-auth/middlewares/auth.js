const { gettUser } = require("../services/auth");

function restrictToLoggedInUserOnly(req, res, next) {
  const userUid = req.cookies?.uid;

  if (!userUid) return res.redirect("/user/signin");

  const user = gettUser(userUid);
  if (!user) return res.redirect("/user/signin");

  req.user = user;
  next();
}

module.exports = { restrictToLoggedInUserOnly };
