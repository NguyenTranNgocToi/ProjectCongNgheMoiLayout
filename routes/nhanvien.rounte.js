const { Connect } = require('aws-sdk');

const expressLayouts = require('express-ejs-layouts');
var express = require('express');
const multer = require('multer');
const upload = multer();

const controllersv = require('../controller/sinhvien.controller');
const controllerkhoa = require('../controller/nhanvienkhoa.controller');
const controllerchuyennganh = require('../controller/NhanVienChuyenNganh.controller');
const controllerlh = require('../controller/lichhoc.controller');
const controllercn = require('../controller/chiachuyennganh.controller');
const controllerchcckh = require('../controller/chuongtrkh.controller');


var database = require("../database");
var router = express.Router();
router.use(express.json({ extended: false }));
router.use(express.static('../views'));
router.use(expressLayouts);

//Nhân Viên
router.get('/trangchu',controllersv.trangchunv );


//Nhân viên cập nhật chuyên ngành
router.get('/cnchuyennganh',controllerchuyennganh.trangcapnhatchuyennganh);
router.get('/cnchuyennganh/add-chuyennganh',controllerchuyennganh.chuyenaddchuyennganh);
router.get('/cnchuyennganh/deletechuyennganh/:chuyennganhid',controllerchuyennganh.xoachuyennganh);
router.get('/cnchuyennganh/editchuyennganh/:chuyennganhid', controllerchuyennganh.chuyeneditchuyennganh);
router.get('/cnchuyennganh/timchuyennganh',upload.fields([]), controllerchuyennganh.timkiemchuyennganh);
router.post('/cnchuyennganh/save_chuyennganh', upload.fields([]),controllerchuyennganh.luuchuyennganh);
router.post('/cnchuyennganh/update_chuyennganh', upload.fields([]), controllerchuyennganh.capnhatchuyennganh);

//Nhân viên cập nhật khoa
router.get('/cnkhoa',controllerkhoa.trangcapnhatkhoa);
router.get('/cnkhoa/add-khoa', controllerkhoa.chuyennhapkhoa);
router.get('/cnkhoa/deletekhoa/:khoaid',controllerkhoa.xoakhoa);
router.get('/cnkhoa/editkhoa/:khoaid', controllerkhoa.chuyeneditkhoa);
router.get('/cnkhoa/timkhoa',upload.fields([]), controllerkhoa.timkiemkhoa);
router.post('/cnkhoa/save_khoa', upload.fields([]),controllerkhoa.luukhoa);
router.post('/cnkhoa/update_khoa', upload.fields([]), controllerkhoa.capnhatkhoa);
router.post('/cnkhoa/uploadfileKhoa', controllerkhoa.uploadfilekhoa);
router.get('/cnkhoa/savedataKhoa', upload.fields([]),controllerkhoa.savedatakhoa);

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
router.get('/cnsinhvien/lockq',controllersv.lockqkh );

//Nhân viên xếp lịch học
router.get('/xeplichhoc', controllerlh.trangxeplich);
router.get('/xeplichhoc/timlhp',upload.fields([]), controllerlh.timlhp);
router.get('/xeplichhoc/xoalich/:malop&:manhom', controllerlh.xoalichhoc);
router.post('/xeplichhoc/uploadfilelh', controllerlh.uploadfile);
router.get('/xeplichhoc/savedata', upload.fields([]),controllerlh.savedata);
router.get('/xeplichhoc/lockq', controllerlh.lockqlh);

//Nhân viên chia chuyên ngành
router.get('/chiachuyennganh', controllercn.trangchiacn);
router.get('/chiachuyennganh/lockq', controllercn.lockqcn);
router.get('/chiachuyennganh/deletesvng/:svid', controllercn.xoasvkhcn);
router.post('/chiachuyennganh/uploadfilesvcn', controllercn.uploadfilesvcn);
router.get('/chiachuyennganh/savedata', upload.fields([]),controllercn.savedata);
router.get('/chiachuyennganh/timsv',upload.fields([]), controllercn.timsvcn);

//nhân viên chia chương trình khung
router.get('/xepkhung', controllerchcckh.trangxepkhung);
router.get('/xepkhung/lockq', controllerchcckh.lockq);
router.get('/xepkhung/deletemhp/:mhid', controllerchcckh.xoamhkhcn);
router.post('/xepkhung/uploadfilemhcn', controllerchcckh.uploadfilemhcn);
router.get('/xepkhung/savedata', upload.fields([]),controllerchcckh.savedata);





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





router.get('/trangchuNV', (req, res) => {
    return res.render('./bodyNhanVien/GD_NV_TrangChu',{layout: './layouts/layoutNhanVien' , title: 'Trang Chủ Nhân Viên'});
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