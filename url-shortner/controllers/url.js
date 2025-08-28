const shortid = require("shortid");
const { URL } = require("../models/url");

// async function generateNewShortUrl(req, res) {
//   const body = req.body;
//   if (!body.url) {
//     return res.status(400).json({ error: "URL is required." });
//   }
//   const shortId = shortid();
//   await URL.create({
//     shortId: shortId,
//     redirectUrl: body.url,
//     visitHistory: [],
//   });

//   return res.json({ id: shortId });
// }

async function generateNewShortUrl(req, res) {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required." });
  }

  // Generate shortId and save
  const shortId = shortid();
  await URL.create({
    shortId,
    redirectUrl: url,
    visitHistory: [],
  });

  // Redirect to index with the new ID in query
  return res.redirect("/?createdId=" + shortId);
}


// async function urlRedirect(req, res) {
//   const shortId = req.params.shortId;
//   const entry = await URL.findOneAndUpdate(
//     { shortId },
//     {
//       $push: {
//         visitHistory: {
//           timestamp: Date.now(),
//         },
//       },
//     }
//   );

//   res.redirect(entry.redirectUrl);
// }

async function urlRedirect(req, res) {
  const { shortId } = req.params;

  try {
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      },
      { new: true } // return the updated document
    );

    if (!entry) {
      // shortId not found → redirect to index page
      return res.redirect("/");
    }

    // Redirect to the original URL
    res.redirect(entry.redirectUrl);
  } catch (err) {
    console.error(err);
    // On server error, also redirect to index as fallback
    res.redirect("/");
  }
}


async function analytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

// async function getAllTheIds(req, res) {
//   try {
//     const urls = await URL.find({});
//     res.render("home", { urls });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// }

async function getAllTheIds(req, res) {
  try {
    const urls = await URL.find({});
    const { createdId } = req.query; // newly created shortId
    res.render("home", { urls, createdId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}




module.exports = {
  generateNewShortUrl,
  urlRedirect,
  analytics,
  getAllTheIds
};
