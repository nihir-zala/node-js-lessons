// middlewares/setUserForViews.js
function setUserForViews(req, res, next) {
  res.locals.user = req.user || null; // make user available in all views
  next();
}

module.exports = setUserForViews;
