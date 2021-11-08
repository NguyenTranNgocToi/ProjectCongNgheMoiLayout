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

var nhanvienRoute = require('./routes/nhanvien.rounte');
var sinhvienRoute = require('./routes/sinhvien.route');


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
app.use('/nhanvien', nhanvienRoute);

//Sinh Viên
app.use('/sinhvien', sinhvienRoute);


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