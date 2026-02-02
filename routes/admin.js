const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/add-product', adminController.getAddProduct);

router.get('/products', adminController.getProducts);

router.post('/add-product', adminController.postAddProduct);

// :productId is a placeholder for dynamic values in the URL
router.get('/edit-product/:productId', adminController.getEditProduct);

module.exports = router;
