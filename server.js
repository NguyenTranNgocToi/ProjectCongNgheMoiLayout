const { Connect } = require('aws-sdk');
const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer();

const cookieParser = require('cookie-parser');
//mã hóa
const bcrypt = require('bcrypt');
const saltRounds = 10;
//layouts
const expressLayouts = require('express-ejs-layouts');
//database NTNT
var database = require("./database");

var nhanvienRoute = require('./routes/nhanvien.rounte');
var sinhvienRoute = require('./routes/sinhvien.route');
 
var authmiddle = require('./middlewares/auth.middleware');

app.use(express.json({ extended: false }));
app.use(express.static('./views'));
app.use(cookieParser());

app.use(expressLayouts);
//app.set('layout', './layouts/layoutChung');
app.set('view engine', 'ejs');
//app.set('views', './views');

//Chung
app.get('/', (req, res) => {
    return res.render('./bodyChung/TrangChu',{layout: './layouts/layoutChung' , title: 'Trang Chủ'}, mess='');
});

//Nhân Viên
app.use('/nhanvien',authmiddle.requireAuth ,nhanvienRoute);

//Sinh Viên
app.use('/sinhvien',authmiddle.requireAuth, sinhvienRoute);


// không menu




app.post('/dangnhaptong', upload.fields([]), (req, res) => {
    var username = req.body.tendn;
    var pass = req.body.matkhau;
    let encryptedPass = '';
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(pass, salt, function (err, hash) {
            encryptedPass = hash;
            database.getPassNV(username, function (resultQuery1) {
                if (resultQuery1.length > 0) {
 
                    bcrypt.compare(pass, resultQuery1[0].Pass.toString(), function (err, result) {
                       
                        if (result) {
                            res.cookie('ms', username);
                            return res.redirect('/nhanvien/trangchu');
                        } else {
                            
                            res.render('./bodyChung/TrangChu',{layout: './layouts/layoutChung' , title: 'Trang Chủ', mess:'pass nv sai' });
                        }
                    });
                } else {
                    database.getPassSV(username, function (resultQuery) {
                        if (resultQuery.length > 0) {

                            bcrypt.compare(pass, resultQuery[0].Pass, function (err, result) {
                                console.log("reult:" + result);
                                if (result) {
                                    res.cookie('ms', username);
                                    return res.redirect('sinhvien/trangchu');
                                } else {
                                   
                                    res.render('./bodyChung/TrangChu',{layout: './layouts/layoutChung' , title: 'Trang Chủ', mess:'pass sv sai' });
                                }

                            });

                        }else{
                           
                            res.render('./bodyChung/TrangChu',{layout: './layouts/layoutChung' , title: 'Trang Chủ', mess:'pass sv sai' });
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