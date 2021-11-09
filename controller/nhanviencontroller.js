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


module.exports.trangcapnhatsv = function (req, res) {
    database.getAllKhoa(function (result) {
        res.render('./bodyNhanVien/CNKhoa', { layout: './layouts/layoutNhanVien', title: 'Cập Nhật Khoa', listkhoa: result });
    })
};

module.exports.trangchunv = function (req, res) {
    return res.render('./bodyNhanVien/GD_NV_TrangChu', { layout: './layouts/layoutNhanVien', title: 'Trang Chủ Khoa' });
};

module.exports.chuyennhapsv = function (req, res) {
    return res.render('./bodyKhongMenu/GD_NV_From_Add_Khoa', { layout: './layouts/layoutKhongMenu', title: 'Thêm Khoa' });
};

module.exports.chuyenedit = function (req, res) {
    const khoaid = req.params.khoaid;
    database.chuyenDenUpdate(khoaid, function (results) {
        console.log(results[0]);
        res.render('GD_NV_From_Update_Khoa', { sv: results[0] });
        // return res.render('./bodyKhongMenu/GD_NV_From_Update_Khoa', { layout: './layouts/layoutKhongMenu', title: 'Cập nhật khoa', khoa: results[0] });
    });
};

module.exports.xoakhoa = function (req, res) {
    const khoaid = req.params.svid;
        database.xoaKhoa(khoaid, function(results){
            res.redirect('/nhanvien/cnkhoa');
        });
};

module.exports.luukhoa = function(req,res){
    console.log(req.body);
    const passdefaut = "123456";
    bcrypt.hash(passdefaut, saltRounds, function(req, res){
        let data = {
            MaKhoa: req.body.tenkhoa, TenKhoa: req.body.tenkhoa
        };
        database.themKhoa(data, function(results){
            res.redirect('/nhanvien/cnkhoa');
        });
    });
};

module.exports.capnhatkhoa = function(req,res){
    const makhoa = req.body.makhoa;
    const tenkhoa = req.body.tenkhoa;

    database.updateKhoa(makhoa,tenkhoa,function (results){
        res.redirect('/nhanvien/cnkhoa');
    });
};

module.exports.uploadfile = function (req, res) {
    upload1(req, res, function (err) {
        if (err) {
            return res.end('Error uploading file');
        }
        res.end('File is uploaded successfully');
    });
};

module.exports.savedata = function (req, res) {
    const schema = {
        'Mã khoa': {
            prop: 'MaKhoa',
            type: String
        },
        'Tên khoa': {
            prop: 'TenKhoa',
            type: String
        }
    }
    const passdefaut = "123456";
    bcrypt.hash(passdefaut, saltRounds, function (err, hash) {
        readXlsxFile('./file/datakhoa.xlsx', { schema }).then(({ rows, errors }) => {
            errors.length === 0;
            for (let i = 0; i < rows.length; i++) {
                // console.log(rows);   
                let data = {
                    MaKhoa: rows[i].MaKhoa, TenKhoa: rows[i].TenKhoa
                };
                // let tk = { MaTaiKhoan: rows[i].MSSV, Pass: hash };
                // console.log(data);
                // database.themSV(data, function (results) {
                //     database.themtaikhoansv(tk, function (resultss) {
                //     })
                // });

            };
            res.redirect('/nhanvien/cnkhoa');
        });
    });
    // readXlsxFile('./file/datasv.xlsx', { schema }).then(({ rows, errors }) => {
    //     errors.length === 0;
    //     for (let i = 0; i < rows.length; i++) {
    //         // console.log(rows);   
    //         let data = {
    //             MSSV: rows[i].MSSV, DiaChi: rows[i].DiaChi, GioiTinh: rows[i].GioiTinh,
    //             HoTen: rows[i].HoTen, NgaySinh: rows[i].NgaySinh, SoDT: rows[i].SoDT
    //         };
    //         console.log(data);
    //         database.themSV(data, function (results) {

    //         });

    //     };
    //     res.redirect('/nhanvien/cnsinhvien');
    // });
};
