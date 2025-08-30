const { Schema, model } = require("mongoose");
const slugify = require("slugify");

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    coverImageURL: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

// Generate slug before saving
blogSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const Blog = model("blog", blogSchema);

module.exports = Blog;
