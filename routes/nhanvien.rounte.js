const { Connect } = require('aws-sdk');

const expressLayouts = require('express-ejs-layouts');
var express = require('express');
const multer = require('multer');
const upload = multer();
const bcrypt = require('bcrypt');
const saltRounds = 10;


var database = require("../database");
var router = express.Router();
router.use(express.json({ extended: false }));
router.use(express.static('../views'));
router.use(expressLayouts);

//Nhân Viên
router.get('/cnkhoa', (req, res) => {
    //return res.render('CNKhoa');
    return res.render('./bodyNhanVien/CNKhoa',{layout: './layouts/layoutNhanVien' , title: 'Cập Nhật Khoa'});
});

router.get('/cnchuyennganh', (req, res) => {
    return res.render('./bodyNhanVien/CNChuyenNganh',{layout: './layouts/layoutNhanVien' , title: 'Cập Nhật Chuyên Ngành'});
});

router.get('/cnsinhvien', (req, res) => {
    //const dsnam = null;
    database.getAllSV(function (results) {
        //return res.render('CNSinhVien', { listsv: results });
        return res.render('./bodyNhanVien/CNSinhVien',{layout: './layouts/layoutNhanVien' , title: 'Cập Nhật Sinh Viên',listsv: results});
    });
});

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


router.get('/cnsinhvien/editsv/:svid', (req, res) => {
    const svid = req.params.svid;
    database.chuyenDenUpdate(svid, function (results) {
        console.log(results[0]);
       // res.render('GD_NV_From_Update_SV', { sv: results[0] });
        return res.render('./bodyKhongMenu/GD_NV_From_Update_SV',{layout: './layouts/layoutKhongMenu' , title: 'Thêm Sinh Viên', sv: results[0] });
    });
});

router.get('/cnsinhvien/deletesv/:svid', (req, res) => {
    const svid = req.params.svid;

    database.xoatksv(svid, function (resultss) {
        database.xoaSV(svid,function(results){
            res.redirect('/nhanvien/cnsinhvien');
        });       
    });
});

router.post('/update_sv', upload.fields([]), (req, res) => {
    const masv = req.body.masv;
    const hoten = req.body.hotensv;
    const gioitinh = req.body.gioitinh;
    const ns = req.body.ns_sv;
    const diachi = req.body.diachi_sv;
    const dt = req.body.dt_sv;
    database.updateSV(masv, hoten, gioitinh, ns, diachi, dt, function (results) {
        res.redirect('/nhanvien/cnsinhvien');
    });
    //console.log(req.body);
});


router.get('/cnsinhvien/add-sv', (req, res) => {
    //res.render('GD_NV_From_Add_SV');
    return res.render('./bodyKhongMenu/GD_NV_From_Add_SV',{layout: './layouts/layoutKhongMenu' , title: 'Thêm Sinh Viên'});
});

router.post('/save_sv', upload.fields([]), (req, res) => {
    console.log(req.body);
    const passdefaut = "123456";
    bcrypt.hash(passdefaut, saltRounds, function(err, hash) {
        let data = {
            MSSV: req.body.masv, DiaChi: req.body.diachi_sv, GioiTinh: req.body.gioitinh,
            HoTen: req.body.hotensv, NgaySinh: req.body.ns_sv, SoDT: req.body.dt_sv
        };
        let tk = { MaTaiKhoan: req.body.masv, Pass: hash };
        database.themSV(data, function (results) {
            database.themtaikhoansv(tk, function (resultss) {
                res.redirect('/nhanvien/cnsinhvien');
                //return res.render('./bodyNhanVien/CNSinhVien',{layout: './layouts/layoutNhanVien' , title: 'Cập Nhật Sinh Viên',listsv: results});
            })
    
        });
    });
    
});
module.exports = router;