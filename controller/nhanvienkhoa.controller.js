var database = require("../database");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const readXlsxFile = require('read-excel-file/node');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './file');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

var upload1 = multer({ storage: storage }).single('myfilekhoa');


module.exports.trangcapnhatkhoa = function (req, res) {
    
    database.getAllKhoa(function (result) {
        res.render('./bodyNhanVien/CNKhoa', { layout: './layouts/layoutNhanVien', title: 'Cập Nhật Khoa', listkhoa : result});
    })
};


module.exports.trangchunv = function (req, res) {
    return res.render('./bodyNhanVien/GD_NV_TrangChu', { layout: './layouts/layoutNhanVien', title: 'Trang Chủ Khoa' });
};

module.exports.chuyennhapkhoa = function (req, res) {
    return res.render('./bodyKhongMenu/GD_NV_Form_Add_Khoa', { layout: './layouts/layoutKhongMenu', title: 'Thêm Khoa' });
};

module.exports.luukhoa = function(req,res){
    console.log(req.body);
        let data = {
            MaKhoa: req.body.makhoa, TenKhoa: req.body.tenkhoa
        };
        database.themKhoa(data, function(results){
            res.redirect('/nhanvien/cnkhoa');
        });
};


module.exports.xoakhoa = function (req, res) {
    const khoaid = req.params.khoaid;
        database.xoaKhoa(khoaid, function(results){
            res.redirect('/nhanvien/cnkhoa');
        });
};

module.exports.chuyenedit = function (req, res) {
    const khoaid = req.params.khoaid;
    database.chuyenDenUpdate(khoaid, function (results) {
        console.log(results[0]);
        // res.render('GD_NV_From_Update_Khoa', { sv: results[0] });
        return res.render('./bodyKhongMenu/GD_NV_Form_Update_Khoa', { layout: './layouts/layoutKhongMenu', title: 'Cập nhật khoa', khoa: results[0] });
    });
};

module.exports.capnhatkhoa = function(req,res){
    const makhoa = req.body.makhoa;
    const tenkhoa = req.body.tenkhoa;

    database.updateKhoa(makhoa,tenkhoa,function (results){
        res.redirect('/nhanvien/cnkhoa');
    });
};