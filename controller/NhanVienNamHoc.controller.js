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

module.exports.trangcapnhatNamHoc = function (req, res) {
    
    database.getAllNamHoc(function (result) {
        res.render('./bodyNhanVien/CNNamHoc', { layout: './layouts/layoutNhanVien', title: 'Cập Nhật Năm Học', listnamhoc : result});
    })
};

module.exports.chuyennhapNamHoc = function (req, res) {
    return res.render('./bodyKhongMenu/GD_NV_Form_Add_NamHoc', { layout: './layouts/layoutKhongMenu', title: 'Thêm Năm Học' });
};

module.exports.luuNamHoc = function(req,res){
    console.log(req.body);
        let data = {
            Nam: req.body.nam
        };
        database.themNamHoc(data, function(results){
            res.redirect('/nhanvien/cnnamhoc');
        });
};

module.exports.xoaNamHoc = function (req, res) {
    const nam = req.params.nam;
        database.xoaNamHoc(nam, function(results){
            res.redirect('/nhanvien/cnnamhoc');
        });
};

module.exports.timkiemNamHoc = function (req, res) {
    var query = req.query.tukhoanamhoc;
    console.log(query);
    database.timkiemNamHoc(query, function (results) {
        if (results.length > 0) {
            res.render('./bodyNhanVien/CNNamHoc', { layout: './layouts/layoutNhanVien', title: 'Cập Nhật Năm Học', listnamhoc: results });
        } else {
            database.getAllNamHoc(function (result) {
                res.render('./bodyNhanVien/CNNamHoc', { layout: './layouts/layoutNhanVien', title: 'Cập Nhật Năm Học', listnamhoc: result });
            });
        }

    });
};