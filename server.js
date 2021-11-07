const { Connect } = require('aws-sdk');
const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer();
//mã hóa
const bcrypt = require('bcrypt');
const saltRounds = 10;
//layouts
const expressLayouts = require('express-ejs-layouts');

//database NTNT
var database = require("./database");






app.use(express.json({ extended: false }));
app.use(express.static('./views'));


app.use(expressLayouts);
//app.set('layout', './layouts/layoutChung');
app.set('view engine', 'ejs');
//app.set('views', './views');

//Chung
app.get('/', (req, res) => {
    return res.render('./bodyChung/TrangChu',{layout: './layouts/layoutChung' , title: 'Trang Chủ'});
});



//Nhân Viên
app.get('/cnkhoa', (req, res) => {
    //return res.render('CNKhoa');
    return res.render('./bodyNhanVien/CNKhoa',{layout: './layouts/layoutNhanVien' , title: 'Cập Nhật Khoa'});
});
app.get('/cnchuyennganh', (req, res) => {
    return res.render('./bodyNhanVien/CNChuyenNganh',{layout: './layouts/layoutNhanVien' , title: 'Cập Nhật Chuyên Ngành'});
});
app.get('/cnsinhvien', (req, res) => {
    //const dsnam = null;
    database.getAllSV(function (results) {
        //return res.render('CNSinhVien', { listsv: results });
        return res.render('./bodyNhanVien/CNSinhVien',{layout: './layouts/layoutNhanVien' , title: 'Cập Nhật Sinh Viên',listsv: results});
    });
});
app.get('/cngiangvien', (req, res) => {
   // return res.render('CNGiangVien');
    return res.render('./bodyNhanVien/CNGiangVien',{layout: './layouts/layoutNhanVien' , title: 'Cập Nhật Giảng Viên'});
});
app.get('/cnmonhp', (req, res) => {
   // return res.render('CNMonHocPhan');
    return res.render('./bodyNhanVien/CNMonHocPhan',{layout: './layouts/layoutNhanVien' , title: 'Cập Nhật Môn Học Phần'});
});

app.get('/cnlophp', (req, res) => {
    //return res.render('CNLopHP');
    return res.render('./bodyNhanVien/CNLopHP',{layout: './layouts/layoutNhanVien' , title: 'Cập Nhật Lớp Học Phần'});
});
app.get('/cnnamhoc', (req, res) => {
    return res.render('./bodyNhanVien/CNNamHoc',{layout: './layouts/layoutNhanVien' , title: 'Cập Nhật Năm Học'});
});
app.get('/cnhocky', (req, res) => {
    return res.render('./bodyNhanVien/CNHocKi',{layout: './layouts/layoutNhanVien' , title: 'Cập Nhật Học Kì'});
});
app.get('/cnphonghoc', (req, res) => {
    return res.render('./bodyNhanVien/CNPhongHoc',{layout: './layouts/layoutNhanVien' , title: 'Cập Nhật Phòng Học'});
});
app.get('/chiachuyennganh', (req, res) => {
    return res.render('./bodyNhanVien/ChiaChuyenNganh',{layout: './layouts/layoutNhanVien' , title: 'Chia Chuyên Ngành'});
});
app.get('/xeplichhoc', (req, res) => {
    return res.render('./bodyNhanVien/XepLichHoc',{layout: './layouts/layoutNhanVien' , title: 'Xếp Lịch Học'});
});

app.get('/xemkhoa', (req, res) => {
    return res.render('./bodyNhanVien/DMKhoa',{layout: './layouts/layoutNhanVien' , title: 'Xem Khoa'});
});


app.get('/xemgiangvien', (req, res) => {

    return res.render('./bodyNhanVien/DMGiangVien',{layout: './layouts/layoutNhanVien' , title: 'Xem Giảng Viên'});
});

app.get('/xemnganh', (req, res) => {
    
    return res.render('./bodyNhanVien/DMChuyenNganh',{layout: './layouts/layoutNhanVien' , title: 'Xem Chuyen Ngành'});
});

app.get('/trangchuNV', (req, res) => {
    return res.render('./bodyNhanVien/GD_NV_TrangChu',{layout: './layouts/layoutNhanVien' , title: 'Trang Chủ Nhân Viên'});
});
app.get('/xepkhung', (req, res) => {
    return res.render('./bodyNhanVien/XepKhung',{layout: './layouts/layoutNhanVien' , title: 'Xếp Khung'});
});
app.get('/timsv', (req, res) => {
    return res.render('./bodyNhanVien/TimKiemSV',{layout: './layouts/layoutNhanVien' , title:'Tìm Kiếm Sinh Viên'});
});

app.get('/timgv', (req, res) => {
    return res.render('./bodyNhanVien/TimKiemGV',{layout: './layouts/layoutNhanVien' , title: 'Tìm Kiếm Giảng Viên'});
});
app.get('/timmonhp', (req, res) => {
    return res.render('./bodyNhanVien/TimKiemMHP',{layout: './layouts/layoutNhanVien' , title: 'Tìm Kiếm Môn Học Phần'});
});
//Sinh Viên
app.get('/trangchu', (req, res) => {

    return res.render('./bodySinhVien/GD_SV_trangchu',{layout: './layouts/layoutSinhVien' , title: 'Trang Chủ Sinh Viên'});
});

app.get('/dangkyhp', (req, res) => {
    
    return res.render('./bodySinhVien/GD_SV_dkhp',{layout: './layouts/layoutSinhVien' , title: 'Đăng Ký Học Phần'});
});


app.get('/xemttcn', (req, res) => {
  
    return res.render('./bodySinhVien/GD_SV_xemttcn',{layout: './layouts/layoutSinhVien' , title: 'Xem Thông Tin Cá Nhân'});
});


app.get('/doimk', (req, res) => {
 
    return res.render('./bodySinhVien/GD_SV_doimk',{layout: './layouts/layoutSinhVien' , title: 'Đổi Mật Khẩu'});
});

app.get('/xemcongno', (req, res) => {

    return res.render('./bodySinhVien/GD_SV_xemcongno',{layout: './layouts/layoutSinhVien' , title: 'Xem Công Nợ'});
});

app.get('/xemctk', (req, res) => {

    return res.render('./bodySinhVien/GD_SV_xemctkhung',{layout: './layouts/layoutSinhVien' , title: 'Xem Chương Trình Khung'});
});


app.get('/xemlh', (req, res) => {

    return res.render('./bodySinhVien/GD_SV_xemlh',{layout: './layouts/layoutSinhVien' , title: 'Xem Lịch Học'});
});
 
// không menu

app.get('/cnsinhvien/add-sv', (req, res) => {
    //res.render('GD_NV_From_Add_SV');
    return res.render('./bodyKhongMenu/GD_NV_From_Add_SV',{layout: './layouts/layoutKhongMenu' , title: 'Thêm Sinh Viên'});
});

app.post('/save_sv', upload.fields([]), (req, res) => {
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
                res.redirect('/cnsinhvien');
                //return res.render('./bodyNhanVien/CNSinhVien',{layout: './layouts/layoutNhanVien' , title: 'Cập Nhật Sinh Viên',listsv: results});
            })
    
        });
    });
    
});

app.get('/cnsinhvien/editsv/:svid', (req, res) => {
    const svid = req.params.svid;
    database.chuyenDenUpdate(svid, function (results) {
        console.log(results[0]);
       // res.render('GD_NV_From_Update_SV', { sv: results[0] });
        return res.render('./bodyKhongMenu/GD_NV_From_Update_SV',{layout: './layouts/layoutKhongMenu' , title: 'Thêm Sinh Viên', sv: results[0] });
    });
});

app.get('/cnsinhvien/deletesv/:svid', (req, res) => {
    const svid = req.params.svid;

    database.xoatksv(svid, function (resultss) {
        database.xoaSV(svid,function(results){
            res.redirect('/cnsinhvien');
        });       
    });
});

app.post('/update_sv', upload.fields([]), (req, res) => {
    const masv = req.body.masv;
    const hoten = req.body.hotensv;
    const gioitinh = req.body.gioitinh;
    const ns = req.body.ns_sv;
    const diachi = req.body.diachi_sv;
    const dt = req.body.dt_sv;
    database.updateSV(masv, hoten, gioitinh, ns, diachi, dt, function (results) {
        res.redirect('/cnsinhvien');
    });
    //console.log(req.body);
});


app.post('/dangnhaptong', upload.fields([]), (req, res) => {
    var username = req.body.tendn;
    var pass = req.body.matkhau;
    let encryptedPass = '';


    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(pass, salt, function (err, hash) {
            // Store hash in your password DB.
            encryptedPass = hash;
            // console.log("hash:"+hash);
            //  console.log("encrypted:"+encryptedPass);

            database.getPassNV(username, function (resultQuery1) {
                if (resultQuery1.length > 0) {
                    // console.log("pass:"+JSON.stringify(resultQuery1));
                    // console.log("pass2:"+resultQuery1[0].Pass);
                    bcrypt.compare(pass, resultQuery1[0].Pass.toString(), function (err, result) {
                        // result == true
                        //console.log("encrypted:"+encryptedPass);
                        // console.log("result 1:"+resultQuery1[0].Pass);
                        // console.log("encrypted2:"+encryptedPass);
                        // console.log("reult:"+ result);
                        if (result) {
                            return res.redirect('/trangchuNV');
                        } else {
                            return res.json({ result: 'pass nv sai' });
                        }
                    });
                } else {
                    database.getPassSV(username, function (resultQuery) {
                        if (resultQuery.length > 0) {

                            bcrypt.compare(pass, resultQuery[0].Pass, function (err, result) {
                                console.log("reult:" + result);
                                if (result) {
                                    return res.redirect('/trangchu');
                                } else {
                                    return res.json({ result: 'pass sv sai' });
                                }

                            });

                        }else{
                            return res.json({ result: 'tên tài khoản không tồn tại' });
                        }
                    });
                }
              
            });

        });
    });
  
    //return res.redirect('/trangchu');   
})
app.listen(3000, () => {
    console.log('Server is running on port 3000!');
});