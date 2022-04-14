var express = require('express');
var router = express.Router();

const userController = require('../components/users/controller');
const jwt = require('jsonwebtoken');
const authentication = require('../middle/authentication');


/**
 * page: login
 * http://localhost:3000/dang-nhap
 * method: get
 */
router.get('/dang-nhap',[authentication.checkLogin], function (req, res, next) {
  res.render('login');
});

/**
 * page: login
 * http://localhost:3000/dang-nhap
 * method: post
 */
router.post('/dang-nhap', async function (req, res, next) {
  // xử lý login
  // đọc email, password từ body
  const {email,password} = req.body;
  // kiểm tra email, password
  console.log('check login',email,password)
  const result = await userController.login(email,password);
  //khong tao duoc token
  if (result) {
    const token = jwt.sign({_id:result._id,email:result.email }, 'myKey');
    console.log('token',token)
    req.session.token = token;
    // nếu đúng: chuyển qua trang sản phẩm
    res.redirect('/san-pham');
  } else {
    // nếu sai: vẫn ở trang login
    res.redirect('/dang-nhap');
  }
});

/**
 * page: logout
 * http://localhost:3000/dang-xuat
 * method: get
 */
router.get('/dang-xuat', [authentication.checkLogin], function (req, res, next) {
  req.session.destroy(function (err) {
    // đăng xuất thành công chuyển sang trang đăng nhập
    res.redirect('/dang-nhap');
  })
});






module.exports = router;



