const { Connect } = require('aws-sdk');
const expressLayouts = require('express-ejs-layouts');
var express = require('express');
var database = require("../database");
var controllerSV = require("../controller/sinhvien.controller");
var router = express.Router();
router.use(express.json({ extended: false }));
router.use(express.static('../views'));
router.use(expressLayouts);


const multer = require('multer');
const upload = multer();

router.get('/trangchu', (req, res) => {

    return res.render('./bodySinhVien/GD_SV_trangchu',{layout: './layouts/layoutSinhVien' , title: 'Trang Chủ Sinh Viên'});
});

router.get('/dangkyhp', (req, res) => {
    
    return res.render('./bodySinhVien/GD_SV_dkhp',{layout: './layouts/layoutSinhVien' , title: 'Đăng Ký Học Phần'});
});

router.get('/xemttcn', (req, res) => {
  
    return res.render('./bodySinhVien/GD_SV_xemttcn',{layout: './layouts/layoutSinhVien' , title: 'Xem Thông Tin Cá Nhân'});
});

router.get('/doimk', controllerSV.doiMatKhauSV);
router.post('/doimatkhau',upload.fields([]), controllerSV.postDoiMatKhauSV);

router.get('/xemcongno', (req, res) => {

    return res.render('./bodySinhVien/GD_SV_xemcongno',{layout: './layouts/layoutSinhVien' , title: 'Xem Công Nợ'});
});

router.get('/xemctk', (req, res) => {

    return res.render('./bodySinhVien/GD_SV_xemctkhung',{layout: './layouts/layoutSinhVien' , title: 'Xem Chương Trình Khung'});
});


router.get('/xemlh', (req, res) => {

    return res.render('./bodySinhVien/GD_SV_xemlh',{layout: './layouts/layoutSinhVien' , title: 'Xem Lịch Học'});
});

router.get('/dangxuat', (req, res) => {
    res.clearCookie('mssv');
    res.clearCookie('msnv');
    return res.redirect('/');
});


module.exports = router;

