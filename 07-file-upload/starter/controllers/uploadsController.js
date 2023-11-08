const path = require("path");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// upload image to local server
const uploadProductImageLocal = async (req, res) => {
  // check if file exists
  // check for image format
  // check for file size

  if (!req.files) {
    throw new BadRequestError("No file uploaded");
  }
  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith("image")) {
    throw new BadRequestError("Please upload image");
  }

  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new BadRequestError("Please upload image with size less than 1KB");
  }
  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );

  await productImage.mv(imagePath);
  return res.status(StatusCodes.OK).json({
    image: { src: `/uploads/${productImage.name}` },
  });
};

// steps:
// 1. save file to the temp folder
// 2. upload the file to cloud provider, in this case: cloudinary
// 3. delete the file from the temp folder
const uploadProductImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "file-upload",
    }
  );
  // delete the file from the temp folder using fs module
  fs.unlinkSync(req.files.image.tempFilePath);
  res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

module.exports = {
  uploadProductImage,
};
