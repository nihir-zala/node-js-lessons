const express = require("express");
const urlRouter = require("./routes/url");
const { connectMongoDB } = require("./connect");
const { urlRedirect, getAllTheIds } = require("./controllers/url");
const path = require("path");

const app = express();
const PORT = 8001;

connectMongoDB("mongodb://localhost:27017/url-shortner").then(() =>
  console.log("Mongo connected")
);


app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use("/url", urlRouter);
app.get("/:shortId", urlRedirect);
app.get("/", getAllTheIds);

app.listen(PORT, () => {
  console.log(`Server Started at: http://localhost:${PORT}`);
});
