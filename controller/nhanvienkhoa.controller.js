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

    var page = parseInt(req.query.page) || 1;
    //console.log(page);
    var perPage = 10;

    var start = (page - 1) * perPage;
    var end = page * perPage;

    database.getAllKhoa(function (result) {
        let sotrang = (result.length) / perPage;
        res.render('./bodyNhanVien/CNKhoa', { layout: './layouts/layoutNhanVien', title: 'Cập Nhật Khoa', listkhoa : result.slice(start,end),sotrang: sotrang+1});
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

module.exports.chuyeneditkhoa = function (req, res) {
    const khoaid = req.params.khoaid;
    database.chuyenDenUpdateKhoa(khoaid, function (results) {
        console.log(results[0]);
        // res.render('GD_NV_From_Update_Khoa', { sv: results[0] });
        return res.render('./bodyKhongMenu/GD_NV_Form_Update_Khoa', { layout: './layouts/layoutKhongMenu', title: 'Cập nhật khoa', khoa: results[0] });
    });
};

module.exports.capnhatkhoa = function(req,res){
    const makhoa = req.body.makhoa;
    const tenkhoa = req.body.tenkhoa;

    console.log(makhoa,tenkhoa);

    database.updateKhoa(makhoa,tenkhoa,function (results){
        res.redirect('/nhanvien/cnkhoa');
    });
};

module.exports.uploadfilekhoa = function (req, res) {
    upload1(req, res, function (err) {
        if (err) {
            return res.end('Error uploading file');
        }
        res.end('File is uploaded successfully');
    });
};

module.exports.savedatakhoa = function (req, res) {
    const schema = {
        'Mã khoa': {
            prop: 'MaKhoa',
            type: String
        },
        'Tên khoa': {
            prop: 'TenKhoa',
            type: String
        },
    };
    var arr = new Array();
    readXlsxFile('./file/datakhoa.xlsx', { schema }).then(({ rows, errors }) => {
        errors.length === 0;
        for (let i = 0; i < rows.length; i++) {
            let makhoa = rows[i].MaKhoa;
            arr.push(makhoa);
        };
        database.kiemtradulieukhoa(arr,function (result) {
            if(result.length>0){
                res.send({ message: 'Khoa có mã số' +'\t'+ result[0].MaKhoa +'\t'+ 'đã tồn tại' });
            }else{   
                for (let a = 0; a < rows.length; a++) {
                    
                    let data = {
                        MaKhoa: rows[a].MaKhoa, TenKhoa: rows[a].TenKhoa
                    };
                    database.themKhoa(data, function (results) {
                        
                    });
        
                };
                res.send({ message: 'thành công' });
            } 
        });
    });
    
    

};

module.exports.timkiemkhoa = function (req, res) {
    var query = req.query.tukhoakhoa;
    console.log(query);
    database.timkiemkhoa(query, function (results) {
        if (results.length > 0) {
            res.render('./bodyNhanVien/CNKhoa', { layout: './layouts/layoutNhanVien', title: 'Cập Nhật Khoa', listkhoa: results });
        } else {
            database.getAllKhoa(function (result) {
                res.render('./bodyNhanVien/CNKhoa', { layout: './layouts/layoutNhanVien', title: 'Cập Nhật Khoa', listkhoa: result });
            });
        }

    });
};