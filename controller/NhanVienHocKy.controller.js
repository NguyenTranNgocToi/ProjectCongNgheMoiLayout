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

module.exports.trangcapnhatHocKy = function (req, res) {
    
    database.getAllHocKy(function (result) {
        res.render('./bodyNhanVien/CNHocki', { layout: './layouts/layoutNhanVien', title: 'Cập Nhật Học Kỳ', listhocky : result});
    })
};

module.exports.chuyennhapHocKy = function (req, res) {
    return res.render('./bodyKhongMenu/GD_NV_Form_Add_HocKy', { layout: './layouts/layoutKhongMenu', title: 'Thêm Học Kỳ' });
};

module.exports.luuHocKy = function(req,res){
    console.log(req.body);
        let data = {
            HocKy: req.body.hocky
        };
        database.themHocKy(data, function(results){
            res.redirect('/nhanvien/cnhocky');
        });
};

module.exports.xoaHocKy = function (req, res) {
    const hocky = req.params.hocky;
        database.xoaHocKy(hocky, function(results){
            res.redirect('/nhanvien/cnhocky');
        });
};
