const express = require('express');
const productsRouter = require('./products');
const cartRouter = require('./cart.js');
const usersRouter = require('./users');

const router = express.Router({mergeParams: true});


//routers
router.use('/products', productsRouter);
router.use('/cart', cartRouter);
router.use('/users', usersRouter);

//exports
module.exports = router;


