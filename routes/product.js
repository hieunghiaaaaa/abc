var express = require('express');
var router = express.Router();

const productController = require('../components/products/controller');
const categoryController = require('../components/categories/controller');

const upload = require('../middle/upload');
const authentication = require('../middle/authentication');

/**
 * page: product
 * http://localhost:3000/san-pham
 * method: get
 * detail: get list products
 * author: Chấn Nguyễn
 * date: 17th March 2022 11:05
 */
router.get('/', [authentication.checkLogin], async function (req, res, next) {
  // lấy danh sách sản phẩm
  const data = await productController.getProducts();
  res.render('products', { products: data });
});

/**
 * page: product
 * http://localhost:3000/san-pham
 * method: post
 * detail: insert new product
 * author: Chấn Nguyễn
 * date: 17th March 2022 11:05
 */
// middleware
router.post('/', [upload.single('image'), authentication.checkLogin],async function (req, res, next) {
  // xử lý thêm mới sản pham
  let { body, file } = req;
  let image = '';
  if (file) {
     image = `http://192.168.1.7:3000/images/${file.filename}`;
  }
  body = {...body, image};
  await productController.insert(body);
  res.redirect('/san-pham');
});

/**
 * page: product
 * http://localhost:3000/san-pham/:id/delete
 * method: delete
 * detail: delete product
 * author: Chấn Nguyễn
 * date: 17th March 2022 11:05
 */
router.delete('/:id/delete', [authentication.checkLogin], async function (req, res, next) {
  // xử lý xóa sản phẩm
  const { id } = req.params;
  await productController.delete(id);
  // trả về dữ liệu dạng json
  res.json({ result: true });
});

/**
 * page: product insert
 * http://localhost:3000/san-pham/:id/insert
 * method: get
 * detail: insert new product
 * author: Chấn Nguyễn
 * date: 17th March 2022 11:05
 */
 router.get('/insert', [authentication.checkLogin], async function (req, res, next) {
  // hiển thị trang thêm mới
  const categories = await categoryController.getCategories();
  res.render('product_insert', { categories: categories });
});

/**
 * page: product
 * http://localhost:3000/san-pham/:id/edit
 * method: get
 * detail: get one product
 * author: Chấn Nguyễn
 * date: 17th March 2022 11:05
 */
router.get('/:id/edit', [authentication.checkLogin], async function (req, res, next) {
  // xử lý lấy một sản phẩm
  const { id } = req.params;
  // lấy chi tiết một sản phẩm
  const product = await productController.getById(id);
  // lấy danh sách danh mục
  const categories = await categoryController.getCategories();
  res.render('product', { product: product, categories: categories });
});


/**
 * page: product
 * http://localhost:3000/san-pham/:id/edit
 * method: post
 * detail: update one product
 * author: Chấn Nguyễn
 * date: 17th March 2022 11:05
 */
router.post('/:id/edit', [upload.single('image'), authentication.checkLogin], async function (req, res, next) {
  // xử lý cập nhật một sản phẩm
  let { params, file, body } = req;
  delete body.image;

  if (file) {
     image = `http://192.168.1.9:3000/images/${file.filename}`;
     body = {...body, image};
  }
 
  await productController.update(params.id, body);

  res.redirect('/san-pham');
});

module.exports = router;