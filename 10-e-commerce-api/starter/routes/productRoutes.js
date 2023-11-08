const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require('../controllers/productController.js');
const {
  authenticateUser,
  authorizePermissions,
} = require('../middlewares/authentication.js');
const {
  getSingleProductReviews,
} = require('../controllers/reviewController.js');

router.post(
  '/',
  authenticateUser,
  authorizePermissions('admin'),
  createProduct
);
router.get('/', getAllProducts);
router.post(
  '/uploadImage',
  authenticateUser,
  authorizePermissions('admin'),
  uploadImage
);
router.get('/:id', getSingleProduct);
router.patch(
  '/:id',
  authenticateUser,
  authorizePermissions('admin'),
  updateProduct
);
router.delete(
  '/:id',
  authenticateUser,
  authorizePermissions('admin'),
  deleteProduct
);
router.get('/:id/reviews', getSingleProductReviews);

module.exports = router;
