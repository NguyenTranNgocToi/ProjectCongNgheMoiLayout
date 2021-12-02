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

router.get('/dangkyhp', controllerSV.dangkyhocphan);

//xem thông tin cá nhân ntnt
router.get('/xemttcn', controllerSV.xemthongtincanha);

//đổi mật khẩu get ntnt
router.get('/doimk', controllerSV.doiMatKhauSV);

//đổi mật khẩu post ntnt
router.post('/doimatkhau',upload.fields([]), controllerSV.postDoiMatKhauSV);

router.get('/xemcongno',controllerSV.xemcongno)

//xem chương trình khung ntnt
router.get('/xemctk',controllerSV.xemchuongtrinhkhung);


router.get('/xemlh', controllerSV.xemlichhoc);

router.get('/dangxuat', (req, res) => {
    res.clearCookie('mssv');
    res.clearCookie('msnv');
    return res.redirect('/');
});

router.get('/ketquahoctap', controllerSV.xemketquahoctap);


module.exports = router;

