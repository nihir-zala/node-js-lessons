const express = require("express");
const {generateNewShortUrl, analytics, getAllTheIds} = require('../controllers/url');

const router = express.Router();

router.post('/',generateNewShortUrl);
router.get('/analytics/:shortId',analytics)
module.exports = router;