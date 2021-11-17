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


const upload = multer();

var upload1 = multer({ storage: storage }).single('myfilesv');


module.exports.trangcapnhatsv = function (req, res) {
    database.getAllSV(function (result) {
        res.render('./bodyNhanVien/CNSinhVien', { layout: './layouts/layoutNhanVien', title: 'Cập Nhật Sinh Viên', listsv: result });
    })
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
            HoTen: req.body.hotensv, NgaySinh: req.body.ns_sv, SoDT: req.body.dt_sv
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
    database.updateSV(masv, hoten, gioitinh, ns, diachi, dt, function (results) {
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
        }
    }
    const passdefaut = "123456";
    bcrypt.hash(passdefaut, saltRounds, function (err, hash) {
        readXlsxFile('./file/datasv.xlsx', { schema }).then(({ rows, errors }) => {
            errors.length === 0;
            for (let i = 0; i < rows.length; i++) {
                // console.log(rows);   
                let data = {
                    MSSV: rows[i].MSSV, DiaChi: rows[i].DiaChi, GioiTinh: rows[i].GioiTinh,
                    HoTen: rows[i].HoTen, NgaySinh: rows[i].NgaySinh, SoDT: rows[i].SoDT
                };
                let tk = { MaTaiKhoan: rows[i].MSSV, Pass: hash };
                console.log(data);
                database.themSV(data, function (results) {
                    database.themtaikhoansv(tk, function (resultss) {
                    })
                });

            };
            res.redirect('/nhanvien/cnsinhvien');
        });
    });
};

module.exports.timkiemsv = function (req, res) {
    var query = req.query.tukhoasv;
    console.log(query);
    database.timkiemsv(query, function (results) {
        if (results.length > 0) {
            res.render('./bodyNhanVien/CNSinhVien', { layout: './layouts/layoutNhanVien', title: 'Cập Nhật Sinh Viên', listsv: results });
        } else {
            database.getAllSV(function (result) {
                res.render('./bodyNhanVien/CNSinhVien', { layout: './layouts/layoutNhanVien', title: 'Cập Nhật Sinh Viên', listsv: result });
            });
        }

    });
};



//đổi mật khẩu sv ntnt
module.exports.doiMatKhauSV = function (req, res) {
    const { cookies } = req;
    console.log(cookies.mssv);
    var mssv = cookies.mssv
    var mkc = "";
    var mkm = "";

    return res.render('./bodySinhVien/GD_SV_doimk', { layout: './layouts/layoutSinhVien', title: 'Đổi Mật Khẩu', mssv, mkc, mkm, erromkc: '', erromkm: '', });
};

module.exports.postDoiMatKhauSV = function (req, res) {
    const { cookies } = req;
    console.log(cookies.mssv);
    var mssv = cookies.mssv

    var mkc = req.body.mkc;
    var mkm = req.body.mkm;

    let doimatkhauthanhcong = 0;
    console.log("post đổi mật khẩu");
    console.log(mkc + "");
    console.log("mật khẩu mới" + mkm + "");
    if (mkc == '' && mkm == '') {
        return res.render('./bodySinhVien/GD_SV_doimk', { layout: './layouts/layoutSinhVien', title: 'Đổi Mật Khẩu', mssv, erromkc: '(trống)', erromkm: '(trống)', mkc, mkm });
    } else if (mkm == '') {
        return res.render('./bodySinhVien/GD_SV_doimk', { layout: './layouts/layoutSinhVien', title: 'Đổi Mật Khẩu', mssv, erromkc: '', erromkm: '(trống)', mkc, mkm });
    }
    else if (mkc == '') {
        return res.render('./bodySinhVien/GD_SV_doimk', { layout: './layouts/layoutSinhVien', title: 'Đổi Mật Khẩu', mssv, erromkc: '(trống)', erromkm: '', mkc, mkm });
    }
    bcrypt.genSalt(saltRounds, (err, salt) => {


        database.getPassSV(mssv, function (resultQuery) {
            if (resultQuery.length > 0) {
                bcrypt.compare(mkc, resultQuery[0].Pass, function (err, result) {
                    console.log("reult:" + result);
                    if (result) {
                       
                        console.log("đổi mật khẩu thành công");
                        doimatkhauthanhcong = 1;
                        console.log("doi mat khau brt" + doimatkhauthanhcong);


                       
                            bcrypt.hash(mkm, salt, function (err, has) {
                                console.log("hash mật khẩu mới" + has);
                                var pass = has;
                                database.updatematkhausv( mssv,pass);
                            });
                            mkc = "";
                            mkm = ""

                    } else {
                        console.log("đổi mk thấy bại");
                        doimatkhauthanhcong = 0;

                    }
                    console.log("doi mat khau" + doimatkhauthanhcong);
                    if (doimatkhauthanhcong == 1) {
                        return res.render('./bodySinhVien/GD_SV_doimk', { layout: './layouts/layoutSinhVien', title: 'Đổi Mật Khẩu', mssv, erromkc: 'Đổi Mật khẩu thành công', erromkm: 'Đổi Mật Khẩu thành công', mkc, mkm });
                    } else {
                        return res.render('./bodySinhVien/GD_SV_doimk', { layout: './layouts/layoutSinhVien', title: 'Đổi Mật Khẩu', mssv, erromkc: 'Mật Khẩu cũ không đúng', erromkm: '', mkc, mkm });
                    }

                });

            }

        });

    });

};
//xem thông tin cá nhân ntnt
module.exports.xemthongtincanha = function(req, res){
    const { cookies } = req;
   // console.log(cookies.mssv);
    var mssv = cookies.mssv
    database.getTTCNSV(mssv, function (resultQuery) {
        // console.log("msss:"+ resultQuery[0].MSSV);
        // console.log("địa chỉ:"+ resultQuery[0].DiaChi);
        // console.log("giới tính:"+ resultQuery[0].GioiTinh);
        // console.log("Họ tên:"+ resultQuery[0].HoTen);
        // console.log("ngày sinh:"+ resultQuery[0].NgaySinh);
        // console.log("Số ĐT:"+ resultQuery[0].SoDT);
        // console.log("Khóa Học:"+ resultQuery[0].KhoaHoc);
        var diachi =resultQuery[0].DiaChi;
        var gioitinh =resultQuery[0].GioiTinh;
        var hoten =resultQuery[0].HoTen;
        var ngaysinh  =resultQuery[0].NgaySinh;
        var sodt =resultQuery[0].SoDT;
        var khoahoc =resultQuery[0].KhoaHoc;
        
        console.log("resultQuery[0]"+resultQuery[0]);
        return res.render('./bodySinhVien/GD_SV_xemttcn',{layout: './layouts/layoutSinhVien' , title: 'Xem Thông Tin Cá Nhân', diachi, gioitinh,ngaysinh,sodt,khoahoc,mssv,hoten});
    });
    //return res.render('./bodySinhVien/GD_SV_xemttcn',{layout: './layouts/layoutSinhVien' , title: 'Xem Thông Tin Cá Nhân', });
};
//xem chương trình khung ntnt

module.exports.xemchuongtrinhkhung = function(req, res){
    const { cookies } = req;
   // console.log(cookies.mssv);
    var mssv = cookies.mssv
    database.xemchuongtrinhkhung(mssv, function (resultQuery) {
        return res.render('./bodySinhVien/GD_SV_xemctkhung',{layout: './layouts/layoutSinhVien' , title: 'Xem Chương Trình Khung', list:resultQuery});
    });
   

};





