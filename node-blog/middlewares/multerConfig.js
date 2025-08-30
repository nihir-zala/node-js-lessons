const multer = require("multer");
const path = require("path");
const fs = require("fs");

/**
 * Creates a multer instance for file uploads.
 * @param {string} folder - Subfolder inside 'public/uploads' (can be user ID)
 * @param {string[]} allowedMimeTypes - Optional: restrict allowed file types
 */
function createMulterUpload(
  folder,
  allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"]
) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.resolve(`./public/uploads/${folder(req)}`);
      if (!fs.existsSync(uploadPath))
        fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images are allowed."), false);
    }
  };

  return multer({ storage, fileFilter });
}

module.exports = createMulterUpload;
