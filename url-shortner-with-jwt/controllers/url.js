const shortid = require("shortid");
const { URL } = require("../models/url");

// Create new short URL
async function generateNewShortUrl(req, res) {
  const { url } = req.body;
  if (!url) return res.status(400).send("URL required");

  const shortId = shortid();
  await URL.create({
    shortId,
    redirectUrl: url,
    visitHistory: [],
    createdBy: req.user._id,
  });

  res.redirect("/?createdId=" + shortId);
}

// Redirect short URL
async function urlRedirect(req, res) {
  const { shortId } = req.params;
  try {
    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true }
    );
    if (!entry) return res.redirect("/");
    res.redirect(entry.redirectUrl);
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
}

// Index page
async function getAllTheIds(req, res) {
  try {
    const urls = await URL.find({ createdBy: req.user._id });
    const { createdId } = req.query;
    res.render("home", { urls, createdId, user: req.user }); // pass user
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}

// Analytics for short URL
async function analytics(req, res) {
  const { shortId } = req.params;
  const url = await URL.findOne({ shortId });
  if (!url) return res.status(404).json({ error: "Not found" });

  res.json({
    totalClicks: url.visitHistory.length,
    analytics: url.visitHistory,
  });
}

module.exports = {
  generateNewShortUrl,
  urlRedirect,
  getAllTheIds,
  analytics,
};
