var database = require('../database');
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
var upload1 = multer({ storage: storage }).single('myfilelh');

module.exports.uploadfile = function (req, res) {
    upload1(req, res, function (err) {
        if (err) {
            return res.end('Error uploading file');
        }
        res.end('File is uploaded successfully');
    });
};

module.exports.trangxeplich = function (req, res) {
    var page = parseInt( req.query.page) || 1;//n
    var perPage = 10;
    var start = (page - 1) *perPage;
    var end = page * perPage;
    database.laylichhoc(function(listlh){
        let sotrang = (listlh.length)/perPage;
        return res.render('./bodyNhanVien/XepLichHoc',{layout: './layouts/layoutNhanVien' , title: 'Xếp Lịch Học',listlh:listlh.slice(start,end),sotrang:sotrang+1});
    });
    
};

module.exports.timlhp = function (req, res) {
    var page = parseInt( req.query.page) || 1;//n
    var perPage = 10;
    var start = (page - 1) *perPage;
    var end = page * perPage;
    var malophp = req.query.malophocphan;
    database.timlophplh(malophp,function(listlh){
        if (listlh.length > 0) {
            let sotrang = (listlh.length)/perPage;
            res.render('./bodyNhanVien/XepLichHoc', { layout: './layouts/layoutNhanVien', title: 'Xếp Lịch Học', listlh:listlh.slice(start,end),sotrang:sotrang+1 });
        } else {
            database.getAllSV(function (result) {
                let sotrang = (result.length)/perPage;
                res.render('./bodyNhanVien/XepLichHoc', { layout: './layouts/layoutNhanVien', title: 'Xếp Lịch Học', listlh:listlh.slice(start,end),sotrang:sotrang+1 });
            });
        }
        
    });
    
};

module.exports.xoalichhoc = function (req, res) {
    const malhp = req.params.malop;
    const manhom = req.params.manhom;
    database.xoalichhoc(malhp,manhom,function(results){
        res.redirect('/nhanvien/xeplichhoc');
    })   
};

module.exports.savedata = function (req, res) {
    const schema = {
        'Mã nhóm': {
            prop: 'MaNhom',
            type: String
        },
        'Mã lớp học phần': {
            prop: 'MaLopHP',
            type: String
        },
        'Tiết học': {
            prop: 'TietHoc',
            type: String
        },
        'Ngày học': {
            prop: 'NgayHoc',
            type: String
        },
        'Phòng học': {
            prop: 'PhongHoc',
            type: String
        },
        'Mã giáo viên': {
            prop: 'MaGV',
            type: String
        },
        'Ngày bắt đầu': {
            prop: 'NgayBatDau',
            type: String
        }
    };
    readXlsxFile('./file/datalichhoc.xlsx', { schema }).then(({ rows, errors }) => {
        errors.length === 0;
            for (let i = 0; i < rows.length; i++) {
                // console.log(rows);   
                let data = {
                    MaNhom: rows[i].MaNhom, MaLopHP: rows[i].MaLopHP, TietHoc: rows[i].TietHoc,
                    NgayHoc: rows[i].NgayHoc, PhongHoc: rows[i].PhongHoc, MaGV: rows[i].MaGV, NgayBatDau: rows[i].NgayBatDau
                };
                database.themlichhoc(data, function (results) {
                });

            };
            res.redirect('/nhanvien/xeplichhoc');
    });
};


