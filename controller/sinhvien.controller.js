var database = require("../database");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const readXlsxFile = require('read-excel-file/node');
var multer = require('multer');
// const { param } = require("../routes/sinhvien.route");
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './file');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});


const upload = multer();

var upload1 = multer({ storage: storage }).single('myfilesv');


module.exports.trangcapnhatsv = function (req, res) {
    // var page = parseInt( req.query.page) || 1;//n
    // var perPage = 10;
    // var start = (page - 1) *perPage;
    // var end = page * perPage;
    // database.getAllSV(function (result) {
    //     let sotrang = (result.length)/perPage;
    //     res.render('./bodyNhanVien/CNSinhVien', { layout: './layouts/layoutNhanVien', title: 'Cập Nhật Sinh Viên', listsv: result.slice(start,end), trang:sotrang+1 });
    // })
    res.render('./bodyNhanVien/CNSinhVien', { layout: './layouts/layoutNhanVien', title: 'Cập Nhật Sinh Viên', listsv: 0, trang: 0,kh:0 });
};

module.exports.lockqkh = function (req, res) {

    var page = parseInt(req.query.page) || 1;
    var perPage = 10;

    var start = (page - 1) * perPage;
    var end = page * perPage;
    var kh = req.query.khoahocsv;

    database.laysvtheokh(kh, function (listsv) {
        let sotrang = (listsv.length) / perPage;
        res.render('./bodyNhanVien/CNSinhVien', { layout: './layouts/layoutNhanVien', title: 'Cập Nhật Sinh Viên', listsv: listsv.slice(start,end), trang: sotrang+1,kh:kh });
    });

};

module.exports.trangchunv = function (req, res) {
    return res.render('./bodyNhanVien/GD_NV_TrangChu', { layout: './layouts/layoutNhanVien', title: 'Trang Chủ Nhân viên' });
};

module.exports.chuyennhapsv = function (req, res) {
    return res.render('./bodyKhongMenu/GD_NV_From_Add_SV', { layout: './layouts/layoutKhongMenu', title: 'Thêm Sinh Viên' });
};

module.exports.chuyenedit = function (req, res) {
    const svid = req.params.svid;
    database.chuyenDenUpdate(svid, function (results) {
        console.log(results[0]);
        // res.render('GD_NV_From_Update_SV', { sv: results[0] });
        return res.render('./bodyKhongMenu/GD_NV_From_Update_SV', { layout: './layouts/layoutKhongMenu', title: 'Cập nhật sinh viên', sv: results[0] });
    });
};

module.exports.xoasv = function (req, res) {
    const svid = req.params.svid;
    database.xoatksv(svid, function (resultss) {
        database.xoaSV(svid, function (results) {
            res.redirect('/nhanvien/cnsinhvien');
        });
    });
};

module.exports.luusv = function (req, res) {
    console.log(req.body);
    const passdefaut = "123456";
    bcrypt.hash(passdefaut, saltRounds, function (err, hash) {
        let data = {
            MSSV: req.body.masv, DiaChi: req.body.diachi_sv, GioiTinh: req.body.gioitinh,
            HoTen: req.body.hotensv, NgaySinh: req.body.ns_sv, SoDT: req.body.dt_sv, KhoaHoc: req.body.khoahoc_sv
        };
        let tk = { MaTaiKhoan: req.body.masv, Pass: hash };
        database.themSV(data, function (results) {
            database.themtaikhoansv(tk, function (resultss) {
                res.redirect('/nhanvien/cnsinhvien');
            })

        });
    });
};

module.exports.capnhatsv = function (req, res) {
    const masv = req.body.masv;
    const hoten = req.body.hotensv;
    const gioitinh = req.body.gioitinh;
    const ns = req.body.ns_sv;
    const diachi = req.body.diachi_sv;
    const dt = req.body.dt_sv;
    const kh = req.body.khoahoc_sv;
    database.updateSV(masv, hoten, gioitinh, ns, diachi, dt, kh, function (results) {
        res.redirect('/nhanvien/cnsinhvien');
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
        'Mã số': {
            prop: 'MSSV',
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
        'Họ tên': {
            prop: 'HoTen',
            type: String
        },
        'Ngày sinh': {
            prop: 'NgaySinh',
            type: String
        },
        'Số điện thoại': {
            prop: 'SoDT',
            type: String
        },
        'Khóa học': {
            prop: 'KhoaHoc',
            type: String
        }
    }
    const passdefaut = "123456";
    bcrypt.hash(passdefaut, saltRounds, function (err, hash) {
        readXlsxFile('./file/datasv.xlsx', { schema }).then(({ rows, errors }) => {
            // if(errors) res.send('Loi file');
            errors.length === 0;
            var mssv = rows[0].MSSV;
            database.kiemtradl(mssv, function (results) {
                if (results.length > 0) {
                    res.send({ message: 'Dữ liệu bị trùng từ mã số:' + results[0].MSSV });
                } else {
                    for (let i = 0; i < rows.length; i++) {
                        let data = {
                            MSSV: rows[i].MSSV, DiaChi: rows[i].DiaChi, GioiTinh: rows[i].GioiTinh,
                            HoTen: rows[i].HoTen, NgaySinh: rows[i].NgaySinh, SoDT: rows[i].SoDT, KhoaHoc: rows[i].KhoaHoc
                        };
                        let tk = { MaTaiKhoan: rows[i].MSSV, Pass: hash };


                        database.themSV(data, function (results) {
                            database.themtaikhoansv(tk, function (resultss) {

                            });
                        });

                    };
                    res.send({ message: 'Thành công' });
                }
            });
        });
    });
};

module.exports.timkiemsv = function (req, res) {
    
    var query = req.query.tukhoasv;
    database.timkiemsv(query, function (results) {
        if (results.length > 0) {
           
            res.render('./bodyNhanVien/CNSinhVien', { layout: './layouts/layoutNhanVien', title: 'Cập Nhật Sinh Viên', listsv:results, trang:0,kh:0 });
        } else {
            database.getAllSV(function (result) {
                res.render('./bodyNhanVien/CNSinhVien', { layout: './layouts/layoutNhanVien', title: 'Cập Nhật Sinh Viên', listsv:0, trang:0,kh:0 });
            });
        }

    });
};
















