const Blog = require("../models/BlogModel");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
mongoose.connect("mongodb://localhost:27017/nodejs-blogs");

async function getAddBlog(req, res) {
  return res.render("create-blog");
}

async function postAddBlog(req, res) {
  const { title, body } = req.body;
  const coverImageURL = req.file
    ? `/uploads/${req.user._id}/${req.file.filename}`
    : undefined;

  const blog = await Blog.create({
    title,
    body,
    coverImageURL,
    createdBy: req.user._id,
  });

  // Redirect using slug if you want
  return res.redirect("/");
}

async function getSingleBlog(req, res) {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug }).populate(
      "createdBy",
      "fullName profileImageURL"
    );

    if (!blog) {
      // Either redirect to index or show a 404 page
      return res.status(404).render("404", { user: req.user });
    }

    res.render("singl-blog", {
      user: req.user,
      blog,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

async function getMyBlogs(req, res) {
  try {
    const blogs = await Blog.find({ createdBy: req.user._id }).populate(
      "createdBy",
      "fullName profileImageURL"
    );

    res.render("my-blogs", {
      user: req.user,
      blogs,
      activePage: "myblogs",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

async function editSingleBlog(req, res) {
  const { id } = req.params; // Assuming blog ID comes from URL, e.g., /blog/edit/:id

  const blog = await Blog.findOne({
    _id: id,
    createdBy: req.user._id,
  }).populate("createdBy", "fullName profileImageURL");

  console.log("blog", blog);

  if (!blog) {
    return res
      .status(404)
      .send("Blog not found or you do not have permission.");
  }

  res.render("edit-blog", {
    user: req.user,
    blog,
  });
}

async function updateBlog(req, res) {
  try {
    const { id } = req.params;
    const { title, body } = req.body;

    // Find blog owned by current user
    const blog = await Blog.findOne({ _id: id, createdBy: req.user._id });
    if (!blog) {
      return res
        .status(403)
        .send("You are not authorized to update this blog.");
    }

    // Handle cover image update
    let coverImageURL = blog.coverImageURL; // keep old if no new file

    if (req.file) {
      // Delete old image if exists
      if (blog.coverImageURL) {
        const oldImagePath = path.join(
          __dirname,
          "../public",
          blog.coverImageURL
        );
        fs.unlink(oldImagePath, (err) => {
          if (err) console.log("Failed to delete old image:", err);
        });
      }

      // Set new image path
      coverImageURL = `/uploads/${req.user._id}/${req.file.filename}`;
    }

    // Update blog document
    blog.title = title;
    blog.body = body;
    blog.coverImageURL = coverImageURL;

    await blog.save();

    res.redirect(`/blog/${blog.slug}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error while updating the blog.");
  }
}

async function deleteBlog(req, res) {
  try {
    const blogId = req.params.id;

    // Find blog by ID AND created by logged-in user
    const blog = await Blog.findOne({ _id: blogId, createdBy: req.user._id });
    if (!blog) {
      return res
        .status(403)
        .send("You are not authorized to delete this blog.");
    }

    // Remove cover image if exists
    if (blog.coverImageURL) {
      const imagePath = path.join(__dirname, "../public", blog.coverImageURL);
      fs.unlink(imagePath, (err) => {
        if (err) console.log("Failed to delete image:", err);
      });
    }

    // Delete blog document
    await Blog.deleteOne({ _id: blogId });

    res.redirect("/blog/my-blogs");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error while deleting the blog.");
  }
}

module.exports = {
  getAddBlog,
  postAddBlog,
  getSingleBlog,
  getMyBlogs,
  editSingleBlog,
  updateBlog,
  deleteBlog,
};
