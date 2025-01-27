const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, updateProductStock } = require('../controllers/product.controller.js');
const { protect, admin } = require('../middlewares/auth.middleware.js');
const { productSchema } = require('../validations/product.validator.js');
const validateRequest = require('../middlewares/validate.middleware.js');
const clerkAuth = require('../middlewares/clerk.middleware.js');
const { getProductReviews, addReview, updateReview, deleteReview,  } = require('../controllers/review.controller.js');
const { upload } = require('../middlewares/multer.middleware.js');

// User Routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/:id/reviews', getProductReviews);
router.put('/update-stock', protect, updateProductStock);
router.post('/:id/reviews', protect, addReview);
router.put('/:productId/reviews/:reviewId', protect, updateReview);
router.delete('/:productId/reviews/:reviewId', protect, deleteReview);

// Admin Routes
router.post('/', protect, admin, upload.fields([
    { name: 'productImages', maxCount: 5 }
]), createProduct);
router.put('/:id', protect, admin, upload.fields([
    { name: 'productImages', maxCount: 5 }
]), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
