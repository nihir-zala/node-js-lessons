const express = require("express");
const router = express.Router();
const {
  getAddBlog,
  postAddBlog,
  getSingleBlog,
  getMyBlogs,
  editSingleBlog,
  updateBlog,
  deleteBlog,
} = require("../controller/BlogController");
const createMulterUpload = require("../middlewares/multerConfig");

const upload = createMulterUpload((req) => req.user._id);

// 1️⃣ Show form to create a blog
router.get("/create", getAddBlog);
router.get("/my-blogs", getMyBlogs);

// 2️⃣ Handle form submission
router.post("/create", upload.single("coverImage"), postAddBlog);

router.get("/edit/:id", editSingleBlog);

// 3️⃣ Dynamic route for single blog by slug (must come last!)
router.get("/:slug", getSingleBlog);
router.post("/edit/:id", upload.single("coverImage"), updateBlog);
router.post("/delete/:id", deleteBlog);

module.exports = router;
