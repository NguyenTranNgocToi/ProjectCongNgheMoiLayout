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
                            return res.redirect('/nhanvien/trangchu');
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