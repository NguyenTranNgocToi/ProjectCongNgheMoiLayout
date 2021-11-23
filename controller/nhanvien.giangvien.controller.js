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

var upload1 = multer({ storage: storage }).single('myfilegv');

module.exports.trangcapnhatgv = function (req, res) {
    database.getGiangVien(function (result) {
        res.render('./bodyNhanVien/CNGiangVien', { layout: './layouts/layoutNhanVien', title: 'Cập Nhật Giảng Viên', listgv : result});
    })
};

module.exports.chuyennhapgv = function (req, res) {
    return res.render('./bodyKhongMenu/GD_NV_Form_Add_GiangVien', { layout: './layouts/layoutKhongMenu', title: 'Thêm Giảng Viên' });
};

module.exports.luugv = function(req,res){
    console.log(req.body);
        let data = {
            MaGV: req.body.magv, HoTen: req.body.hotengv ,DiaChi: req.body.diachigv, GioiTinh: req.body.gioitinhgv,
             NgaySinh: req.body.ngaysinhsv, SoDt: req.body.sodt, MaKhoa: req.body.makhoa
        };
        database.themGV(data, function(results){
            res.redirect('/nhanvien/cngiangvien');
        });
};

module.exports.xoagv = function (req, res) {
    const gvid = req.params.gvid;
        database.xoaGV(gvid, function(results){
            res.redirect('/nhanvien/cngiangvien');
        });
};

module.exports.chuyeneditgv = function (req, res) {
    const gvid = req.params.gvid;
    database.chuyenDenUpdateGV(gvid, function (results) {
        console.log(results[0]);
        return res.render('./bodyKhongMenu/GD_NV_Form_Update_GiangVien', { layout: './layouts/layoutKhongMenu', title: 'Cập nhật giảng viên', giangvien: results[0] });
    });
};

module.exports.capnhatgv = function(req,res){
    const magv = req.body.magv;
    const hoten = req.body.hoten;
    const diachi = req.body.diachi;
    const gioitinh = req.body.gioitinh;
    const ngaysinh = req.body.ngaysinh;
    const sodt = req.body.sodt;

    database.updateGV(hoten,diachi,gioitinh,ngaysinh,sodt,magv,function (results){
        res.redirect('/nhanvien/cngiangvien');
    });
    console.log(hoten,diachi,gioitinh,ngaysinh,sodt,magv);
};

module.exports.timkiemgv = function (req, res) {
    var query = req.query.tukhoagv;
    console.log(query);
    database.timkiemGV(query, function (results) {
        if (results.length > 0) {
            res.render('./bodyNhanVien/CNGiangVien', { layout: './layouts/layoutNhanVien', title: 'Cập Nhật Giảng Viên', listgv: results });
        } else {
            database.getGiangVien(function (result) {
                res.render('./bodyNhanVien/CNGiangVien', { layout: './layouts/layoutNhanVien', title: 'Cập Nhật Giảng Viên', listgv: result });
            });
        }

    });
};

module.exports.uploadfileGV = function (req, res) {
    upload1(req, res, function (err) {
        if (err) {
            return res.end('Error uploading file');
        }
        res.end('File is uploaded successfully');
    });
};

module.exports.savedataGV = function (req, res) {
    const schema = {
        'Mã giảng viên': {
            prop: 'MaGV',
            type: String
        },
        'Họ tên': {
            prop: 'HoTen',
            type: String
        },
        'Địa chỉ': {
            prop: 'DiaChi',
            type: String
        },
        'Giới tính': {
            prop: 'GioiTinh',
            type: String
        },
        'Ngày sinh': {
            prop: 'NgaySinh',
            type: String
        },
        'Số điện thoại': {
            prop: 'SoDt',
            type: String
        },
        'Mã khoa': {
            prop: 'MaKhoa',
            type: String
        },
    };
    var arr = new Array();
    readXlsxFile('./file/datagv.xlsx', { schema }).then(({ rows, errors }) => {
        errors.length === 0;
        for (let i = 0; i < rows.length; i++) {   
            let giangvien = rows[i].MaGV;
            arr.push(giangvien);

        };
        database.giangvienkiemtradulieu(arr,function (results) {
            if(results.length>0){
                res.send({message: 'Giảng viên có mã'+ '\t' + results[0].MaGV + '\t' + 'đã tồn tại' });
            }else{
                for (let a = 0; a < rows.length; a++) {   
                    let data = {
                        MaGV: rows[a].MaGV, HoTen: rows[a].HoTen, DiaChi: rows[a].DiaChi, GioiTinh: rows[a].GioiTinh,
                        NgaySinh: rows[a].NgaySinh, SoDt: rows[a].SoDt, MaKhoa: rows[a].MaKhoa
                    };
                    database.themGV(data, function (results) {
                        
                    });
                };
                res.send({ message: 'Đã thêm' });
            }
        });
        
    });

};

