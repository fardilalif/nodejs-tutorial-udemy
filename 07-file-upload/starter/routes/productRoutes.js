const express = require("express");
const router = express.Router();

// import create product and get all products from the controller
const {
  createProduct,
  getAllProducts,
} = require("../controllers/productController.js");
const { uploadProductImage } = require("../controllers/uploadsController.js");

router.route("/").post(createProduct).get(getAllProducts);
router.route("/uploads").post(uploadProductImage);

module.exports = router;
