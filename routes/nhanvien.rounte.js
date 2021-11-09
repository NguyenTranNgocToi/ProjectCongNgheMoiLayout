const { Connect } = require('aws-sdk');

const expressLayouts = require('express-ejs-layouts');
var express = require('express');
const multer = require('multer');
const upload = multer();

const controllersv = require('../controller/sinhvien.controller');
const controllerkhoa = require('../controller/nhanvienkhoa.controller');


var database = require("../database");
var router = express.Router();
router.use(express.json({ extended: false }));
router.use(express.static('../views'));
router.use(expressLayouts);

//Nhân Viên
router.get('/trangchu',controllersv.trangchunv );



router.get('/cnchuyennganh', (req, res) => {
    return res.render('./bodyNhanVien/CNChuyenNganh',{layout: './layouts/layoutNhanVien' , title: 'Cập Nhật Chuyên Ngành'});
});

//Nhan vien cap nhat khoa
router.get('/cnkhoa',controllerkhoa.trangcapnhatkhoa);
router.get('/cnkhoa/add-khoa', controllerkhoa.chuyennhapkhoa);
router.get('/cnkhoa/deletekhoa/:khoaid',controllerkhoa.xoakhoa);
router.get('/cnkhoa/editkhoa/:khoaid', controllerkhoa.chuyenedit);
router.post('/cnkhoa/save_khoa', upload.fields([]),controllerkhoa.luukhoa);

//Nhân viên cập nhật sinh viên
router.get('/cnsinhvien',controllersv.trangcapnhatsv );
router.get('/cnsinhvien/add-sv', controllersv.chuyennhapsv);
router.get('/cnsinhvien/editsv/:svid', controllersv.chuyenedit);
router.get('/cnsinhvien/deletesv/:svid', controllersv.xoasv);
router.post('/cnsinhvien/save_sv', upload.fields([]), controllersv.luusv);
router.post('/cnsinhvien/update_sv', upload.fields([]), controllersv.capnhatsv);
router.post('/cnsinhvien/uploadfileSV', controllersv.uploadfile);
router.get('/cnsinhvien/savedata', upload.fields([]),controllersv.savedata);
router.get('/cnsinhvien/timsv', upload.fields([]),controllersv.timkiemsv);




router.get('/cngiangvien', (req, res) => {
   // return res.render('CNGiangVien');
    return res.render('./bodyNhanVien/CNGiangVien',{layout: './layouts/layoutNhanVien' , title: 'Cập Nhật Giảng Viên'});
});

router.get('/cnmonhp', (req, res) => {
   // return res.render('CNMonHocPhan');
    return res.render('./bodyNhanVien/CNMonHocPhan',{layout: './layouts/layoutNhanVien' , title: 'Cập Nhật Môn Học Phần'});
});

router.get('/cnlophp', (req, res) => {
    //return res.render('CNLopHP');
    return res.render('./bodyNhanVien/CNLopHP',{layout: './layouts/layoutNhanVien' , title: 'Cập Nhật Lớp Học Phần'});
});

router.get('/cnnamhoc', (req, res) => {
    return res.render('./bodyNhanVien/CNNamHoc',{layout: './layouts/layoutNhanVien' , title: 'Cập Nhật Năm Học'});
});

router.get('/cnhocky', (req, res) => {
    return res.render('./bodyNhanVien/CNHocKi',{layout: './layouts/layoutNhanVien' , title: 'Cập Nhật Học Kì'});
});

router.get('/cnphonghoc', (req, res) => {
    return res.render('./bodyNhanVien/CNPhongHoc',{layout: './layouts/layoutNhanVien' , title: 'Cập Nhật Phòng Học'});
});

router.get('/chiachuyennganh', (req, res) => {
    return res.render('./bodyNhanVien/ChiaChuyenNganh',{layout: './layouts/layoutNhanVien' , title: 'Chia Chuyên Ngành'});
});

router.get('/xeplichhoc', (req, res) => {
    return res.render('./bodyNhanVien/XepLichHoc',{layout: './layouts/layoutNhanVien' , title: 'Xếp Lịch Học'});
});

router.get('/xemkhoa', (req, res) => {
    return res.render('./bodyNhanVien/DMKhoa',{layout: './layouts/layoutNhanVien' , title: 'Xem Khoa'});
});

router.get('/xemgiangvien', (req, res) => {

    return res.render('./bodyNhanVien/DMGiangVien',{layout: './layouts/layoutNhanVien' , title: 'Xem Giảng Viên'});
});

router.get('/xemnganh', (req, res) => {
    
    return res.render('./bodyNhanVien/DMChuyenNganh',{layout: './layouts/layoutNhanVien' , title: 'Xem Chuyen Ngành'});
});

router.get('/trangchuNV', (req, res) => {
    return res.render('./bodyNhanVien/GD_NV_TrangChu',{layout: './layouts/layoutNhanVien' , title: 'Trang Chủ Nhân Viên'});
});

router.get('/xepkhung', (req, res) => {
    return res.render('./bodyNhanVien/XepKhung',{layout: './layouts/layoutNhanVien' , title: 'Xếp Khung'});
});

router.get('/timsv', (req, res) => {
    return res.render('./bodyNhanVien/TimKiemSV',{layout: './layouts/layoutNhanVien' , title:'Tìm Kiếm Sinh Viên'});
});

router.get('/timgv', (req, res) => {
    return res.render('./bodyNhanVien/TimKiemGV',{layout: './layouts/layoutNhanVien' , title: 'Tìm Kiếm Giảng Viên'});
});
router.get('/timmonhp', (req, res) => {
    return res.render('./bodyNhanVien/TimKiemMHP',{layout: './layouts/layoutNhanVien' , title: 'Tìm Kiếm Môn Học Phần'});
});



module.exports = router;