const express = require("express");
const router = express.Router();
const { generateNewShortUrl, analytics } = require("../controllers/url");

router.post("/", generateNewShortUrl);
router.get("/analytics/:shortId", analytics);

module.exports = router;
