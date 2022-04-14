var express = require('express');
var router = express.Router();

const userController = require('../components/users/controller');
const productController = require('../components/products/controller');
const jwt = require('jsonwebtoken');
const authentication = require('../middle/authentication');


/**
 * page: register
 * http://localhost:3000/api/register
 * method: post
 */
 router.post('/register', async function (req, res, next) {
    const { email, password, confirm_password } = req.body;
    const result = await userController.register(email, password, confirm_password);
    if (result) {
      res.json({status: true});
    } else {
        res.json({status: false});
    }
  });

  /**
 * page: login
 * http://localhost:3000/api/login
 * method: post
 */
 router.post('/login', async function (req, res, next) {
    const { email, password } = req.body;
    const result = await userController.login(email,password);
    if (result) {
      const token = jwt.sign({ _id: result._id, email: result.email }, 'myKey');
      console.log('token cua toi',token)
      res.json({status: true, result, token });
    } else {
        res.json({status: false});
    }
  });


/**
 * page: product
 * http://localhost:3000/api/products
 * method: get
 * detail: get list products
 * author: Chấn Nguyễn
 * date: 17th March 2022 11:05
 */
 router.get('/products', [authentication.checkToken], async function (req, res, next) {
    const products = await productController.getProducts();
    res.json(products);
  });

  router.get('/products/:id/detail', [authentication.checkToken], async function (req, res, next) {
    const { id } = req.params;
    const product = await productController.getById(id);
    res.json(product);
  });


module.exports = router;