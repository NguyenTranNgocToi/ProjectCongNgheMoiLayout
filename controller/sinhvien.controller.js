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

//đổi mật khẩu sv ntnt
module.exports.doiMatKhauSV = function (req, res) {
    const { cookies } = req;
    // console.log(cookies.mssv);
    var mssv = cookies.mssv
    var mkc = "";
    var mkm = "";

    return res.render('./bodySinhVien/GD_SV_doimk', { layout: './layouts/layoutSinhVien', title: 'Đổi Mật Khẩu', mssv, mkc, mkm, erromkc: '', erromkm: '', });
};

module.exports.postDoiMatKhauSV = function (req, res) {
    const { cookies } = req;
    // console.log(cookies.mssv);
    var mssv = cookies.mssv

    var mkc = req.body.mkc;
    var mkm = req.body.mkm;

    let doimatkhauthanhcong = 0;
    // console.log("post đổi mật khẩu");
    // console.log(mkc + "");
    // console.log("mật khẩu mới" + mkm + "");
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
        var list = resultQuery;
        console.log("list:"+ list[0]);
        return res.render('./bodySinhVien/GD_SV_xemctkhung',{layout: './layouts/layoutSinhVien' , title: 'Xem Chương Trình Khung', list:resultQuery});
    });
   

};

//đăng ký học phần ntnt
module.exports.dangkyhocphan = function(req,res){
    var hocky = req.query.hocky;
    var namhoc = req.query.namhoc;
    

    const { cookies } = req;
    var mssv = cookies.mssv
    console.log(mssv);

    var mamonhoc = req.query.monhp;
    var malophoc = req.query.lophocphan;

    var manhomth =  req.query.nhomth;
    var manhomlt =  req.query.nhomlt;
    var chonlophocdadangky =  req.query.lhpddk;

    console.log("học kỳ:"+hocky);
    console.log("năm học:"+namhoc);
    console.log("mã môn học"+mamonhoc);
    console.log("mã lớp học"+malophoc);
    var listmh;
    var listlh;
    var listthuchanh;
    var listlythuyet;
    var listmonhocdadangky;
    var lophoc;
    var monhoctienquyet;
    var dahocmontienquyet;
    var lophochuy;
    var lophocdangky;
    var mess="";
    var mess1="";
    var mess2="";
    console.log("mã th:"+manhomth);
    console.log("mã lt:"+manhomlt);
    console.log("mã lớp đã chọn để hủy:"+chonlophocdadangky);

    if(chonlophocdadangky!=""){
         database.huydangkyhocphanchosinhvien(mssv,chonlophocdadangky);
         database.laymotlophocphanchosinhvien(chonlophocdadangky, function (resultQuery5) {
            lophochuy = resultQuery5;
            if(lophochuy!=""){
                console.log("lophochuy:"+lophochuy[0].DaDangKy);
                var x = lophochuy[0].DaDangKy;
                console.log("x:"+x);
                x = parseInt(x)-1;
                console.log("x2:"+x);
                database.updatesisosinhviendadangkytrongmotlop(x,chonlophocdadangky);
            }
         });   
    }

        database.laydanhsachmonhocphanchosinhvien(mssv,hocky,namhoc, function (resultQuery){
             listmh = resultQuery;
            console.log("listmh:"+ listmh[0]);
            //console.log("listmh mã 0 :"+ listmh[0].MaMHP);
            //console.log("resultQuerymh"+ resultQuery.length);
                database.laydanhsachlophocphanchosinhvien(mamonhoc, function (resultQuery1){ 
                     listlh = resultQuery1;
                    //console.log("listlh:"+ listlh[0].MalopHP);
                    // console.log("resultQuerylh"+ resultQuery1.length);
                    database.laydanhsachlophodadangkychosinhvien(hocky,namhoc,mssv, function (resultQuery2){
                        listmonhocdadangky = resultQuery2
                        database.laydanhsachlophocphanthuchanhchosinhvien(malophoc, function (resultQuery3){ 
                            listthuchanh = resultQuery3;
                            
                            database.laydanhsachlophocphanlythuyetchosinhvien(malophoc, function (resultQuery4){
                                
                                listlythuyet = resultQuery4;

                               //kiểm tra trường hợp đăng ký lý thuyết mà không đăng ký thực hành 
                               if(listthuchanh.length>0 && listlythuyet.length>0 && manhomth!= null && manhomlt != null){
                                console.log("thực hành lý thuyết >0 mã nhóm thực hành lý thuyết khác null");

                                //kiểm tra xem lớp đầy chưa
                                  //kiểm tra xem lớp đầy chưa
                                  database.laymotlophocphanchosinhvien(malophoc, function (resultQuery5) {
                                    lophoc = resultQuery5;
                                    console.log("lophoc"+ lophoc[0].DaDangKy);
                                    console.log("lophoc"+ lophoc[0].SiSo);
                                    if(lophoc[0].DaDangKy == lophoc[0].SiSo){
                                        mess ="lớp học đã đủ người";
                                        console.log("mess"+mess);
                                        //res.send(mess);
                                        return res.render('./bodySinhVien/GD_SV_dkhp',{
                                            layout: './layouts/layoutSinhVien' , 
                                            title: 'Đăng Ký Học Phần', 
                                            listmh, 
                                            listlh,
                                            listthuchanh,
                                            listlythuyet,
                                            listmonhocdadangky, 
                                            namhoc, 
                                            hocky,
                                            mamonhoc,
                                            malophoc,
                                            mess,
                                            mess1,
                                            mess2
                                        });
                                        
                                    }else{
                                        //kiểm tra lớp học phần có môn học tiên quyết hay không
                                        database.laymonhocphantienquyetchosinhvien(malophoc,function (resultQuery7) {
                                            monhoctienquyet = resultQuery7;
                                            if(monhoctienquyet.length>0){
                                                console.log("mon hoc phan tien quyet:"+monhoctienquyet[0].TenMHHP);
                                                //kiểm tra sinh viên đã học môn tiên quyết chưa
                                                database.sinhviendahocphantienquyetchua(malophoc,mssv, function (resultQuery8) {
                                                    dahocmontienquyet= resultQuery8;
                                                    //sinh viên chưa học môn tiên quyết
                                                    if(dahocmontienquyet.length<=0){
                                                    mess1="chưa học môn tiên quyết";     
                                                    //console.log("đã học môn tiên quyết <=0"+ dahocmontienquyet[0].TenMHHP);
                                                    return res.render('./bodySinhVien/GD_SV_dkhp',{
                                                        layout: './layouts/layoutSinhVien' , 
                                                        title: 'Đăng Ký Học Phần', 
                                                        listmh, 
                                                        listlh,
                                                        listthuchanh,
                                                        listlythuyet,
                                                        listmonhocdadangky, 
                                                        namhoc, 
                                                        hocky,
                                                        mamonhoc,
                                                        malophoc,
                                                        mess,
                                                        mess1,
                                                        mess2
                                                    });
                                                    //sinh viên đã học môn tiên quyết
                                                    }else{
                                                        mess1="đã học học môn tiên quyết"; 
                                                        console.log("đã học môn tiên quyết"+ dahocmontienquyet[0].TenMHHP);

                                                        //kiểm tra trùng thời gian cho sinh viên
                                                        database.kiemtralichtrungthoigianchosinhvien(hocky,namhoc,mssv,malophoc,manhomlt, function (ktthoigian) {
                                                            //sinh viên bị trùng thời gian 
                                                           
                                                            if(ktthoigian.length> 0){
                                                                    mess2="trùng lịch học lý thuyết"
                                                                    return res.render('./bodySinhVien/GD_SV_dkhp',{
                                                                        layout: './layouts/layoutSinhVien' , 
                                                                        title: 'Đăng Ký Học Phần', 
                                                                        listmh, 
                                                                        listlh,
                                                                        listthuchanh,
                                                                        listlythuyet,
                                                                        listmonhocdadangky, 
                                                                        namhoc, 
                                                                        hocky,
                                                                        mamonhoc,
                                                                        malophoc,
                                                                        mess,
                                                                        mess1,
                                                                        mess2
                                                                    });
                                                            //sinh viên không bị trùng lịch học     
                                                            }else{
                                                                console.log("mã nhóm thực hành kiểm tra:"+manhomth);
                                                                database.kiemtralichtrungthoigianchosinhvien(hocky,namhoc,mssv,malophoc,manhomth, function (ktthoigianthuchanh) {
                                                                    if(ktthoigianthuchanh.length> 0){
                                                                        mess2="trùng lịch học thực hành"
                                                                        return res.render('./bodySinhVien/GD_SV_dkhp',{
                                                                            layout: './layouts/layoutSinhVien' , 
                                                                            title: 'Đăng Ký Học Phần', 
                                                                            listmh, 
                                                                            listlh,
                                                                            listthuchanh,
                                                                            listlythuyet,
                                                                            listmonhocdadangky, 
                                                                            namhoc, 
                                                                            hocky,
                                                                            mamonhoc,
                                                                            malophoc,
                                                                            mess,
                                                                            mess1,
                                                                            mess2
                                                                        });
                                                                    }else{
                                                                        mess2="không trùng lịch học"
                                                                        //thêm đăng ký 2
                                                                        database.dangkyhocphanchosinhvien(mssv,malophoc,manhomlt);
                                                                        database.dangkyhocphanchosinhvien(mssv,malophoc,manhomth);

                                                                        //tăng 1 sinh viên cho lớp học
                                                                        database.laymotlophocphanchosinhvien(malophoc, function (resultQuery5) {
                                                                            lophocdangky = resultQuery5;
                                                                            if(lophocdangky!=""){
                                                                                console.log("lophochuy:"+lophocdangky[0].DaDangKy);
                                                                                var x = lophocdangky[0].DaDangKy;
                                                                                console.log("x:"+x);
                                                                                x = parseInt(x)+1;
                                                                                console.log("x2:"+x);
                                                                                database.updatesisosinhviendadangkytrongmotlop(x,malophoc);
                                                                            }
                                                                         });   
                                                                        return res.render('./bodySinhVien/GD_SV_dkhp',{
                                                                            layout: './layouts/layoutSinhVien' , 
                                                                            title: 'Đăng Ký Học Phần', 
                                                                            listmh, 
                                                                            listlh,
                                                                            listthuchanh,
                                                                            listlythuyet,
                                                                            listmonhocdadangky, 
                                                                            namhoc, 
                                                                            hocky,
                                                                            mamonhoc,
                                                                            malophoc,
                                                                            mess,
                                                                            mess1,
                                                                            mess2
                                                                        });
                                                                    }
                                                                });
                                                              
                                                            } 
                                                    
            
                                                        });
                                                    }
                                                
                                                })
                                            }else{
                                               //kiểm tra trùng thời gian cho sinh viên
                                                database.kiemtralichtrungthoigianchosinhvien(hocky,namhoc,mssv,malophoc,manhomlt, function (ktthoigian) {
                                                    //sinh viên bị trùng thời gian 
                                                   
                                                    if(ktthoigian.length> 0){
                                                            mess2="trùng lịch học lý thuyết"
                                                            return res.render('./bodySinhVien/GD_SV_dkhp',{
                                                                layout: './layouts/layoutSinhVien' , 
                                                                title: 'Đăng Ký Học Phần', 
                                                                listmh, 
                                                                listlh,
                                                                listthuchanh,
                                                                listlythuyet,
                                                                listmonhocdadangky, 
                                                                namhoc, 
                                                                hocky,
                                                                mamonhoc,
                                                                malophoc,
                                                                mess,
                                                                mess1,
                                                                mess2
                                                            });
                                                    //sinh viên không bị trùng lịch học     
                                                    }else{
                                                        console.log("mã nhóm thực hành kiểm tra:"+manhomth);
                                                        database.kiemtralichtrungthoigianchosinhvien(hocky,namhoc,mssv,malophoc,manhomth, function (ktthoigianthuchanh) {
                                                            if(ktthoigianthuchanh.length> 0){
                                                                mess2="trùng lịch học thực hành"
                                                                return res.render('./bodySinhVien/GD_SV_dkhp',{
                                                                    layout: './layouts/layoutSinhVien' , 
                                                                    title: 'Đăng Ký Học Phần', 
                                                                    listmh, 
                                                                    listlh,
                                                                    listthuchanh,
                                                                    listlythuyet,
                                                                    listmonhocdadangky, 
                                                                    namhoc, 
                                                                    hocky,
                                                                    mamonhoc,
                                                                    malophoc,
                                                                    mess,
                                                                    mess1,
                                                                    mess2
                                                                });
                                                            }else{
                                                                mess2="Đăng ký thành công"
                                                                //thêm đăng ký 3
                                                                database.dangkyhocphanchosinhvien(mssv,malophoc,manhomlt);
                                                                database.dangkyhocphanchosinhvien(mssv,malophoc,manhomth);

                                                                 //tăng 1 sinh viên cho lớp học
                                                                 database.laymotlophocphanchosinhvien(malophoc, function (resultQuery5) {
                                                                    lophocdangky = resultQuery5;
                                                                    if(lophocdangky!=""){
                                                                        console.log("lophochuy:"+lophocdangky[0].DaDangKy);
                                                                        var x = lophocdangky[0].DaDangKy;
                                                                        console.log("x:"+x);
                                                                        x = parseInt(x)+1;
                                                                        console.log("x2:"+x);
                                                                        database.updatesisosinhviendadangkytrongmotlop(x,malophoc);
                                                                    }
                                                                 });  
                                                                return res.render('./bodySinhVien/GD_SV_dkhp',{
                                                                    layout: './layouts/layoutSinhVien' , 
                                                                    title: 'Đăng Ký Học Phần', 
                                                                    listmh, 
                                                                    listlh,
                                                                    listthuchanh,
                                                                    listlythuyet,
                                                                    listmonhocdadangky, 
                                                                    namhoc, 
                                                                    hocky,
                                                                    mamonhoc,
                                                                    malophoc,
                                                                    mess,
                                                                    mess1,
                                                                    mess2
                                                                });
                                                            }
                                                        });
                                                      
                                                    } 
                                            
    
                                                });
                                                
                                            }
    

                                        })
                                    }

                                });

                               }
                               //kiểm tra trường hợp không có thực hành, có lý thuyết nhưng không chọn lý thuyết    
                               else if(listthuchanh.length<=0 && listlythuyet.length>0 && manhomth== null && manhomlt != null){
                                    console.log("thực hành <=0 lý thuyết >0 mã nhóm thực hành null lý thuyết khác null");

                                    //kiểm tra xem lớp đầy chưa
                                    database.laymotlophocphanchosinhvien(malophoc, function (resultQuery5) {
                                        lophoc = resultQuery5;
                                        console.log("lophoc"+ lophoc[0].DaDangKy);
                                        console.log("lophoc"+ lophoc[0].SiSo);
                                        if(lophoc[0].DaDangKy == lophoc[0].SiSo){
                                            mess ="lớp học đã đủ người";
                                            console.log("mess"+mess);
                                            //res.send(mess);
                                            return res.render('./bodySinhVien/GD_SV_dkhp',{
                                                layout: './layouts/layoutSinhVien' , 
                                                title: 'Đăng Ký Học Phần', 
                                                listmh, 
                                                listlh,
                                                listthuchanh,
                                                listlythuyet,
                                                listmonhocdadangky, 
                                                namhoc, 
                                                hocky,
                                                mamonhoc,
                                                malophoc,
                                                mess,
                                                mess1,
                                                mess2
                                            });
                                            
                                        }
                                        else{
                                            //kiểm tra lớp học phần có môn học tiên quyết hay không
                                            database.laymonhocphantienquyetchosinhvien(malophoc,function (resultQuery7) {
                                                monhoctienquyet = resultQuery7;
                                                if(monhoctienquyet.length>0){
                                                    console.log("mon hoc phan tien quyet:"+monhoctienquyet[0].TenMHHP);

                                                    //kiểm tra sinh viên đã học môn tiên quyết chưa
                                                    database.sinhviendahocphantienquyetchua(malophoc,mssv, function (resultQuery8) {
                                                        dahocmontienquyet= resultQuery8;
                                                        //sinh viên chưa học môn tiên quyết
                                                        if(dahocmontienquyet.length<=0){
                                                        mess1="chưa học môn tiên quyết";     
                                                        //console.log("đã học môn tiên quyết <=0"+ dahocmontienquyet[0].TenMHHP);
                                                        return res.render('./bodySinhVien/GD_SV_dkhp',{
                                                            layout: './layouts/layoutSinhVien' , 
                                                            title: 'Đăng Ký Học Phần', 
                                                            listmh, 
                                                            listlh,
                                                            listthuchanh,
                                                            listlythuyet,
                                                            listmonhocdadangky, 
                                                            namhoc, 
                                                            hocky,
                                                            mamonhoc,
                                                            malophoc,
                                                            mess,
                                                            mess1,
                                                            mess2
                                                        });
                                                        //sinh viên đã học môn tiên quyết
                                                        }else{
                                                            mess1="đã học học môn tiên quyết"; 
                                                            console.log("đã học môn tiên quyết"+ dahocmontienquyet[0].TenMHHP);

                                                            //kiểm tra trùng thời gian cho sinh viên
                                                            database.kiemtralichtrungthoigianchosinhvien(hocky,namhoc,mssv,malophoc,manhomlt, function (ktthoigian) {
                                                            //sinh viên bị trùng thời gian 
                                                            if(ktthoigian.length> 0){
                                                                    mess2="trùng lịch học"
                                                                    return res.render('./bodySinhVien/GD_SV_dkhp',{
                                                                        layout: './layouts/layoutSinhVien' , 
                                                                        title: 'Đăng Ký Học Phần', 
                                                                        listmh, 
                                                                        listlh,
                                                                        listthuchanh,
                                                                        listlythuyet,
                                                                        listmonhocdadangky, 
                                                                        namhoc, 
                                                                        hocky,
                                                                        mamonhoc,
                                                                        malophoc,
                                                                        mess,
                                                                        mess1,
                                                                        mess2
                                                                    });
                                                            //sinh viên không bị trùng lịch học     
                                                            }
                                                            else{
                                                                mess2="Đăng ký thành công"
                                                                database.dangkyhocphanchosinhvien(mssv,malophoc,manhomlt);

                                                                 //tăng 1 sinh viên cho lớp học
                                                                 database.laymotlophocphanchosinhvien(malophoc, function (resultQuery5) {
                                                                    lophocdangky = resultQuery5;
                                                                    if(lophocdangky!=""){
                                                                        console.log("lophochuy:"+lophocdangky[0].DaDangKy);
                                                                        var x = lophocdangky[0].DaDangKy;
                                                                        console.log("x:"+x);
                                                                        x = parseInt(x)+1;
                                                                        console.log("x2:"+x);
                                                                        database.updatesisosinhviendadangkytrongmotlop(x,malophoc);
                                                                    }
                                                                 });  
                                                                return res.render('./bodySinhVien/GD_SV_dkhp',{
                                                                    layout: './layouts/layoutSinhVien' , 
                                                                    title: 'Đăng Ký Học Phần', 
                                                                    listmh, 
                                                                    listlh,
                                                                    listthuchanh,
                                                                    listlythuyet,
                                                                    listmonhocdadangky, 
                                                                    namhoc, 
                                                                    hocky,
                                                                    mamonhoc,
                                                                    malophoc,
                                                                    mess,
                                                                    mess1,
                                                                    mess2
                                                                });
                                                                
                                                               
                                                                
                                                            } 
                                                            console.log("mess21"+mess2);
                                                           
                                                            });
                                                            console.log("mess22"+mess2);
                                                        }
                                                    
                                                    });
                                                }else{
                                                     //kiểm tra trùng thời gian cho sinh viên
                                                     database.kiemtralichtrungthoigianchosinhvien(hocky,namhoc,mssv,malophoc,manhomlt, function (ktthoigian) {
                                                        //sinh viên bị trùng thời gian 
                                                        if(ktthoigian.length> 0){
                                                            mess2="trùng lịch học"
                                                        //sinh viên không bị trùng lịch học     
                                                        }else{
                                                            mess2="Đăng ký thành công"
                                                            database.dangkyhocphanchosinhvien(mssv,malophoc,manhomlt);
                                                             //tăng 1 sinh viên cho lớp học
                                                             database.laymotlophocphanchosinhvien(malophoc, function (resultQuery5) {
                                                                lophocdangky = resultQuery5;
                                                                if(lophocdangky!=""){
                                                                    console.log("lophochuy:"+lophocdangky[0].DaDangKy);
                                                                    var x = lophocdangky[0].DaDangKy;
                                                                    console.log("x:"+x);
                                                                    x = parseInt(x)+1;
                                                                    console.log("x2:"+x);
                                                                    database.updatesisosinhviendadangkytrongmotlop(x,malophoc);
                                                                }
                                                             });  
                                                
                                                            
                                                            return res.render('./bodySinhVien/GD_SV_dkhp',{
                                                                layout: './layouts/layoutSinhVien' , 
                                                                title: 'Đăng Ký Học Phần', 
                                                                listmh, 
                                                                listlh,
                                                                listthuchanh,
                                                                listlythuyet,
                                                                listmonhocdadangky, 
                                                                namhoc, 
                                                                hocky,
                                                                mamonhoc,
                                                                malophoc,
                                                                mess,
                                                                mess1,
                                                                mess2
                                                            }); 
                                                        } 
                                                        console.log("mess21"+mess2);
                                                       
                                                        });
                                                    
                                                }
        

                                            });
                                        }
                                    });
                               }
                               else{
                                return res.render('./bodySinhVien/GD_SV_dkhp',{
                                    layout: './layouts/layoutSinhVien' , 
                                    title: 'Đăng Ký Học Phần', 
                                    listmh, 
                                    listlh,
                                    listthuchanh,
                                    listlythuyet,
                                    listmonhocdadangky, 
                                    namhoc, 
                                    hocky,
                                    mamonhoc,
                                    malophoc,
                                    mess,
                                    mess1,
                                    mess2
                                });
                               }
                                    
                             });
                        
                          
    
                        });
                     }); 
                   
                   
                 });
        });
};

//xem công nợ
module.exports.xemcongno = function(req, res){
    const { cookies } = req;
   // console.log(cookies.mssv);
    var mssv = cookies.mssv
    var list;
    var tong = 0;
    database.laycongnochosinhvien(mssv, function (resultQuery) {
        list = resultQuery;
        //console.log("list:"+ list);
        
        for(let i=0;i< list.length;i++){
            tong = tong +list[i].SoTinChi*790000 ;
        }
        console.log("tong:"+tong);
        return res.render('./bodySinhVien/GD_SV_xemcongno',{layout: './layouts/layoutSinhVien' , title: 'Xem Công Nợ', list:resultQuery, tong});

    });
   

};

//xem lịch học
module.exports.xemlichhoc = function(req, res){
    const { cookies } = req;
   // console.log(cookies.mssv);
    var mssv = cookies.mssv
    var list;
    var hocky = req.query.hocky;
    var namhoc = req.query.namhoc;
    if(hocky=="")
        hocky = "1";
    if(namhoc =="")    
        nam ="2021-2022";
    var thu2_13_phong, thu2_46_phong, thu2_79_phong, thu2_1012_phong, thu2_1315_phong;
    var thu3_13_phong, thu3_46_phong, thu3_79_phong, thu3_1012_phong, thu3_1315_phong;
    var thu4_13_phong, thu4_46_phong, thu4_79_phong, thu4_1012_phong, thu4_1315_phong;
    var thu5_13_phong, thu5_46_phong, thu5_79_phong, thu5_1012_phong, thu5_1315_phong;
    var thu6_13_phong, thu6_46_phong, thu6_79_phong, thu6_1012_phong, thu6_1315_phong;
    var thu7_13_phong, thu7_46_phong, thu7_79_phong, thu7_1012_phong, thu7_1315_phong;
    var chunhat_13_phong, chunhat_46_phong, chunhat_79_phong, chunhat_1012_phong, chunhat_1315_phong;

    var thu2_13_malop, thu2_46_malop, thu2_79_malop, thu2_1012_malop, thu2_1315_malop;
    var thu3_13_malop, thu3_46_malop, thu3_79_malop, thu3_1012_malop, thu3_1315_malop;
    var thu4_13_malop, thu4_46_malop, thu4_79_malop, thu4_1012_malop, thu4_1315_malop;
    var thu5_13_malop, thu5_46_malop, thu5_79_malop, thu5_1012_malop, thu5_1315_malop;
    var thu6_13_malop, thu6_46_malop, thu6_79_malop, thu6_1012_malop, thu6_1315_malop;
    var thu7_13_malop, thu7_46_malop, thu7_79_malop, thu7_1012_malop, thu7_1315_malop;
    var chunhat_13_malop, chunhat_46_malop, chunhat_79_malop, chunhat_1012_malop, chunhat_1315_malop;

    var thu2_13_nhom, thu2_46_nhom, thu2_79_nhom, thu2_1012_nhom, thu2_1315_nhom;
    var thu3_13_nhom, thu3_46_nhom, thu3_79_nhom, thu3_1012_nhom, thu3_1315_nhom;
    var thu4_13_nhom, thu4_46_nhom, thu4_79_nhom, thu4_1012_nhom, thu4_1315_nhom;
    var thu5_13_nhom, thu5_46_nhom, thu5_79_nhom, thu5_1012_nhom, thu5_1315_nhom;
    var thu6_13_nhom, thu6_46_nhom, thu6_79_nhom, thu6_1012_nhom, thu6_1315_nhom;
    var thu7_13_nhom, thu7_46_nhom, thu7_79_nhom, thu7_1012_nhom, thu7_1315_nhom;
    var chunhat_13_nhom, chunhat_46_nhom, chunhat_79_nhom, chunhat_1012_nhom, chunhat_1315_nhom;

    var thu2_13_tenmon, thu2_46_tenmon, thu2_79_tenmon, thu2_1012_tenmon, thu2_1315_tenmon;
    var thu3_13_tenmon, thu3_46_tenmon, thu3_79_tenmon, thu3_1012_tenmon, thu3_1315_tenmon;
    var thu4_13_tenmon, thu4_46_tenmon, thu4_79_tenmon, thu4_1012_tenmon, thu4_1315_tenmon;
    var thu5_13_tenmon, thu5_46_tenmon, thu5_79_tenmon, thu5_1012_tenmon, thu5_1315_tenmon;
    var thu6_13_tenmon, thu6_46_tenmon, thu6_79_tenmon, thu6_1012_tenmon, thu6_1315_tenmon;
    var thu7_13_tenmon, thu7_46_tenmon, thu7_79_tenmon, thu7_1012_tenmon, thu7_1315_tenmon;
    var chunhat_13_tenmon, chunhat_46_tenmon, chunhat_79_tenmon, chunhat_1012_tenmon, chunhat_1315_tenmon;

    var thu2_13_gv, thu2_46_gv, thu2_79_gv, thu2_1012_gv, thu2_1315_gv;
    var thu3_13_gv, thu3_46_gv, thu3_79_gv, thu3_1012_gv, thu3_1315_gv;
    var thu4_13_gv, thu4_46_gv, thu4_79_gv, thu4_1012_gv, thu4_1315_gv;
    var thu5_13_gv, thu5_46_gv, thu5_79_gv, thu5_1012_gv, thu5_1315_gv;
    var thu6_13_gv, thu6_46_gv, thu6_79_gv, thu6_1012_gv, thu6_1315_gv;
    var thu7_13_gv, thu7_46_gv, thu7_79_gv, thu7_1012_gv, thu7_1315_gv;
    var chunhat_13_gv, chunhat_46_gv, chunhat_79_gv, chunhat_1012_gv, chunhat_1315_gv;
    

    database.laylichhocchosinhvien(hocky,namhoc, mssv, function (resultQuery) {
        list = resultQuery;
        console.log("list:"+ list);
        
        for(let i=0;i< list.length;i++){
            if(list[i].NgayHoc=="Thứ 2"){
                if(list[i].TietHoc=="01-03"){
                    thu2_13_gv ="Giảng viên:"+list[i].HoTen;
                    thu2_13_malop ="Lớp:"+list[i].MaLopHP;
                    thu2_13_nhom =list[i].Nhom;
                    thu2_13_phong ="Phòng:"+list[i].PhongHoc;
                    thu2_13_tenmon ="Môn học:"+list[i].TenMHHP;
                }
                if(list[i].TietHoc=="04-06"){
                    thu2_46_gv ="Giảng viên:"+list[i].HoTen;
                    thu2_46_malop ="Lớp:"+list[i].MaLopHP;
                    thu2_46_nhom =list[i].Nhom;
                    thu2_46_phong ="Phòng:"+list[i].PhongHoc;
                    thu2_46_tenmon ="Môn học:"+list[i].TenMHHP;
                }
                if(list[i].TietHoc=="07-09"){
                    thu2_79_gv ="Giảng viên:"+list[i].HoTen;
                    thu2_79_malop ="Lớp:"+list[i].MaLopHP;
                    thu2_79_nhom =list[i].Nhom;
                    thu2_79_phong ="Phòng:"+list[i].PhongHoc;
                    thu2_79_tenmon ="Môn học:"+list[i].TenMHHP;
                }
                if(list[i].TietHoc=="10-12"){
                    thu2_1012_gv ="Giảng viên:"+list[i].HoTen;
                    thu2_1012_malop ="Lớp:"+list[i].MaLopHP;
                    thu2_1012_nhom =list[i].Nhom;
                    thu2_1012_phong ="Phòng:"+list[i].PhongHoc;
                    thu2_1012_tenmon ="Môn học:"+list[i].TenMHHP;
                }
                if(list[i].TietHoc=="13-15"){
                    thu2_1315_gv ="Giảng viên:"+list[i].HoTen;
                    thu2_1315_malop ="Lớp:"+list[i].MaLopHP;
                    thu2_1315_nhom =list[i].Nhom;
                    thu2_1315_phong ="Phòng:"+list[i].PhongHoc;
                    thu2_1315_tenmon ="Môn học:"+list[i].TenMHHP;
                }         
            }
            if(list[i].NgayHoc=="Thứ 3"){
                if(list[i].TietHoc=="01-03"){
                    thu3_13_gv ="Giảng viên:"+list[i].HoTen;
                    thu3_13_malop ="Lớp:"+list[i].MaLopHP;
                    thu3_13_nhom =list[i].Nhom;
                    thu3_13_phong ="Phòng:"+list[i].PhongHoc;
                    thu3_13_tenmon ="Môn học:"+list[i].TenMHHP;
                }
                if(list[i].TietHoc=="04-06"){
                    thu3_46_gv ="Giảng viên:"+list[i].HoTen;
                    thu3_46_malop ="Lớp:"+list[i].MaLopHP;
                    thu3_46_nhom =list[i].Nhom;
                    thu3_46_phong ="Phòng:"+list[i].PhongHoc;
                    thu3_46_tenmon ="Môn học:"+list[i].TenMHHP;
                }
                if(list[i].TietHoc=="07-09"){
                    thu3_79_gv ="Giảng viên:"+list[i].HoTen;
                    thu3_79_malop ="Lớp:"+list[i].MaLopHP;
                    thu3_79_nhom =list[i].Nhom;
                    thu3_79_phong ="Phòng:"+list[i].PhongHoc;
                    thu3_79_tenmon ="Môn học:"+list[i].TenMHHP;
                }
                
                if(list[i].TietHoc=="10-12"){
                    thu3_1012_gv ="Giảng viên:"+list[i].HoTen;
                    thu3_1012_malop ="Lớp:"+list[i].MaLopHP;
                    thu3_1012_nhom =list[i].Nhom;
                    thu3_1012_phong ="Phòng:"+list[i].PhongHoc;
                    thu3_1012_tenmon ="Môn học:"+list[i].TenMHHP;
                }
                if(list[i].TietHoc=="13-15"){
                    thu3_1315_gv ="Giảng viên:"+list[i].HoTen;
                    thu3_1315_malop ="Lớp:"+list[i].MaLopHP;
                    thu3_1315_nhom =list[i].Nhom;
                    thu3_1315_phong ="Phòng:"+list[i].PhongHoc;
                    thu3_1315_tenmon ="Môn học:"+list[i].TenMHHP;
                }
            }
            if(list[i].NgayHoc=="Thứ 4"){
                if(list[i].TietHoc=="01-03"){
                    thu4_13_gv ="Giảng viên:"+list[i].HoTen;
                    thu4_13_malop ="Lớp:"+list[i].MaLopHP;
                    thu4_13_nhom =list[i].Nhom;
                    thu4_13_phong ="Phòng:"+list[i].PhongHoc;
                    thu4_13_tenmon ="Môn học:"+list[i].TenMHHP;
                }
                if(list[i].TietHoc=="04-06"){
                    thu4_46_gv ="Giảng viên:"+list[i].HoTen;
                    thu4_46_malop ="Lớp:"+list[i].MaLopHP;
                    thu4_46_nhom =list[i].Nhom;
                    thu4_46_phong ="Phòng:"+list[i].PhongHoc;
                    thu4_46_tenmon ="Môn học:"+list[i].TenMHHP;
                }
                if(list[i].TietHoc=="07-09"){
                    thu4_79_gv ="Giảng viên:"+list[i].HoTen;
                    thu4_79_malop ="Lớp:"+list[i].MaLopHP;
                    thu4_79_nhom =list[i].Nhom;
                    thu4_79_phong ="Phòng:"+list[i].PhongHoc;
                    thu4_79_tenmon ="Môn học:"+list[i].TenMHHP;
                }
                if(list[i].TietHoc=="10-12"){
                    thu4_1012_gv ="Giảng viên:"+list[i].HoTen;
                    thu4_1012_malop ="Lớp:"+list[i].MaLopHP;
                    thu4_1012_nhom =list[i].Nhom;
                    thu4_1012_phong ="Phòng:"+list[i].PhongHoc;
                    thu4_1012_tenmon ="Môn học:"+list[i].TenMHHP;
                }
                   
                if(list[i].TietHoc=="13-15"){
                    thu4_1315_gv ="Giảng viên:"+list[i].HoTen;
                    thu4_1315_malop ="Lớp:"+list[i].MaLopHP;
                    thu4_1315_nhom =list[i].Nhom;
                    thu4_1315_phong ="Phòng:"+list[i].PhongHoc;
                    thu4_1315_tenmon ="Môn học:"+list[i].TenMHHP;
                }
            }
            if(list[i].NgayHoc=="Thứ 5"){
                if(list[i].TietHoc=="01-03"){
                    thu5_13_gv ="Giảng viên:"+list[i].HoTen;
                    thu5_13_malop ="Lớp:"+list[i].MaLopHP;
                    thu5_13_nhom =list[i].Nhom;
                    thu5_13_phong ="Phòng:"+list[i].PhongHoc;
                    thu5_13_tenmon ="Môn học:"+list[i].TenMHHP;
                }
                if(list[i].TietHoc=="04-06"){
                    thu5_46_gv ="Giảng viên:"+list[i].HoTen;
                    thu5_46_malop ="Lớp:"+list[i].MaLopHP;
                    thu5_46_nhom =list[i].Nhom;
                    thu5_46_phong ="Phòng:"+list[i].PhongHoc;
                    thu5_46_tenmon ="Môn học:"+list[i].TenMHHP;
                }
                if(list[i].TietHoc=="07-09"){
                    thu5_79_gv ="Giảng viên:"+list[i].HoTen;
                    thu5_79_malop ="Lớp:"+list[i].MaLopHP;
                    thu5_79_nhom =list[i].Nhom;
                    thu5_79_phong ="Phòng:"+list[i].PhongHoc;
                    thu5_79_tenmon ="Môn học:"+list[i].TenMHHP;
                }
                    
                if(list[i].TietHoc=="10-12"){
                    thu5_1012_gv ="Giảng viên:"+list[i].HoTen;
                    thu5_1012_malop ="Lớp:"+list[i].MaLopHP;
                    thu5_1012_nhom =list[i].Nhom;
                    thu5_1012_phong ="Phòng:"+list[i].PhongHoc;
                    thu5_1012_tenmon ="Môn học:"+list[i].TenMHHP;
                }
                if(list[i].TietHoc=="13-15"){
                    thu5_1315_gv ="Giảng viên:"+list[i].HoTen;
                    thu5_1315_malop ="Lớp:"+list[i].MaLopHP;
                    thu5_1315_nhom =list[i].Nhom;
                    thu5_1315_phong ="Phòng:"+list[i].PhongHoc;
                    thu5_1315_tenmon ="Môn học:"+list[i].TenMHHP; 
                }
            }
            if(list[i].NgayHoc=="Thứ 6"){
                if(list[i].TietHoc=="01-03"){
                    thu6_13_gv ="Giảng viên:"+list[i].HoTen;
                    thu6_13_malop ="Lớp:"+list[i].MaLopHP;
                    thu6_13_nhom =list[i].Nhom;
                    thu6_13_phong ="Phòng:"+list[i].PhongHoc;
                    thu6_13_tenmon ="Môn học:"+list[i].TenMHHP;  
                }
                if(list[i].TietHoc=="04-06"){
                    thu6_46_gv ="Giảng viên:"+list[i].HoTen;
                    thu6_46_malop ="Lớp:"+list[i].MaLopHP;
                    thu6_46_nhom =list[i].Nhom;
                    thu6_46_phong ="Phòng:"+list[i].PhongHoc;
                    thu6_46_tenmon ="Môn học:"+list[i].TenMHHP;
                }
                if(list[i].TietHoc=="07-09"){
                    thu6_79_gv ="Giảng viên:"+list[i].HoTen;
                    thu6_79_malop ="Lớp:"+list[i].MaLopHP;
                    thu6_79_nhom =list[i].Nhom;
                    thu6_79_phong ="Phòng:"+list[i].PhongHoc;
                    thu6_79_tenmon ="Môn học:"+list[i].TenMHHP;
                }
                if(list[i].TietHoc=="10-12"){
                    thu6_1012_gv ="Giảng viên:"+list[i].HoTen;
                    thu6_1012_malop ="Lớp:"+list[i].MaLopHP;
                    thu6_1012_nhom =list[i].Nhom;
                    thu6_1012_phong ="Phòng:"+list[i].PhongHoc;
                    thu6_1012_tenmon ="Môn học:"+list[i].TenMHHP;
                }
                if(list[i].TietHoc=="13-15"){
                    thu6_1315_gv ="Giảng viên:"+list[i].HoTen;
                    thu6_1315_malop ="Lớp:"+list[i].MaLopHP;
                    thu6_1315_nhom =list[i].Nhom;
                    thu6_1315_phong ="Phòng:"+list[i].PhongHoc;
                    thu6_1315_tenmon ="Môn học:"+list[i].TenMHHP;
                }
            }
            if(list[i].NgayHoc=="Thứ 7"){
                if(list[i].TietHoc=="01-03"){
                    thu7_13_gv ="Giảng viên:"+list[i].HoTen;
                    thu7_13_malop ="Lớp:"+list[i].MaLopHP;
                    thu7_13_nhom =list[i].Nhom;
                    thu7_13_phong ="Phòng:"+list[i].PhongHoc;
                    thu7_13_tenmon ="Môn học:"+list[i].TenMHHP;
                }
                if(list[i].TietHoc=="04-06"){
                    thu7_46_gv ="Giảng viên:"+list[i].HoTen;
                    thu7_46_malop ="Lớp:"+list[i].MaLopHP;
                    thu7_46_nhom =list[i].Nhom;
                    thu7_46_phong ="Phòng:"+list[i].PhongHoc;
                    thu7_46_tenmon ="Môn học:"+list[i].TenMHHP;
                }
                if(list[i].TietHoc=="07-09"){
                    thu7_79_gv ="Giảng viên:"+list[i].HoTen;
                    thu7_79_malop ="Lớp:"+list[i].MaLopHP;
                    thu7_79_nhom =list[i].Nhom;
                    thu7_79_phong ="Phòng:"+list[i].PhongHoc;
                    thu7_79_tenmon ="Môn học:"+list[i].TenMHHP;
                }
                if(list[i].TietHoc=="10-12"){
                    thu7_1012_gv ="Giảng viên:"+list[i].HoTen;
                    thu7_1012_malop ="Lớp:"+list[i].MaLopHP;
                    thu7_1012_nhom =list[i].Nhom;
                    thu7_1012_phong ="Phòng:"+list[i].PhongHoc;
                    thu7_1012_tenmon ="Môn học:"+list[i].TenMHHP;
                }
                if(list[i].TietHoc=="13-15"){
                    thu7_1315_gv ="Giảng viên:"+list[i].HoTen;
                    thu7_1315_malop ="Lớp:"+list[i].MaLopHP;
                    thu7_1315_nhom =list[i].Nhom;
                    thu7_1315_phong ="Phòng:"+list[i].PhongHoc;
                    thu7_1315_tenmon ="Môn học:"+list[i].TenMHHP;
                }
            }
            if(list[i].NgayHoc=="Chủ nhật"){
                if(list[i].TietHoc=="01-03"){
                    chunhat_13_gv ="Giảng viên:"+list[i].HoTen;
                    chunhat_13_malop ="Lớp:"+list[i].MaLopHP;
                    chunhat_13_nhom =list[i].Nhom;
                    chunhat_13_phong ="Phòng:"+list[i].PhongHoc;
                    chunhat_13_tenmon ="Môn học:"+list[i].TenMHHP;
                }
                
                if(list[i].TietHoc=="04-06"){
                    chunhat_46_gv ="Giảng viên:"+list[i].HoTen;
                    chunhat_46_malop ="Lớp:"+list[i].MaLopHP;
                    chunhat_46_nhom =list[i].Nhom;
                    chunhat_46_phong ="Phòng:"+list[i].PhongHoc;
                    chunhat_46_tenmon ="Môn học:"+list[i].TenMHHP;
                }
                if(list[i].TietHoc=="07-09"){
                    chunhat_79_gv ="Giảng viên:"+list[i].HoTen;
                    chunhat_79_malop ="Lớp:"+list[i].MaLopHP;
                    chunhat_79_nhom =list[i].Nhom;
                    chunhat_79_phong ="Phòng:"+list[i].PhongHoc;
                    chunhat_79_tenmon ="Môn học:"+list[i].TenMHHP;
                }
                
                if(list[i].TietHoc=="10-12"){
                    chunhat_1012_gv ="Giảng viên:"+list[i].HoTen;
                    chunhat_1012_malop ="Lớp:"+list[i].MaLopHP;
                    chunhat_1012_nhom =list[i].Nhom;
                    chunhat_1012_phong ="Phòng:"+list[i].PhongHoc;
                    chunhat_1012_tenmon ="Môn học:"+list[i].TenMHHP;
                }
            
                if(list[i].TietHoc=="13-15"){
                    chunhat_1315_gv ="Giảng viên:"+list[i].HoTen;
                    chunhat_1315_malop ="Lớp:"+list[i].MaLopHP;
                    chunhat_1315_nhom =list[i].Nhom;
                    chunhat_1315_phong ="Phòng:"+list[i].PhongHoc;
                    chunhat_1315_tenmon ="Môn học:"+list[i].TenMHHP;
                }
            }
           
        }
        return res.render('./bodySinhVien/GD_SV_xemlh',
            {layout: './layouts/layoutSinhVien' , 
            title: 'Xem Lịch Học',
            namhoc,
            hocky,
            thu2_13_phong, thu2_46_phong, thu2_79_phong, thu2_1012_phong, thu2_1315_phong,
            thu3_13_phong, thu3_46_phong, thu3_79_phong, thu3_1012_phong, thu3_1315_phong,
            thu4_13_phong, thu4_46_phong, thu4_79_phong, thu4_1012_phong, thu4_1315_phong,
            thu5_13_phong, thu5_46_phong, thu5_79_phong, thu5_1012_phong, thu5_1315_phong,
            thu6_13_phong, thu6_46_phong, thu6_79_phong, thu6_1012_phong, thu6_1315_phong,
            thu7_13_phong, thu7_46_phong, thu7_79_phong, thu7_1012_phong, thu7_1315_phong,
            chunhat_13_phong, chunhat_46_phong, chunhat_79_phong, chunhat_1012_phong, chunhat_1315_phong,

            thu2_13_malop, thu2_46_malop, thu2_79_malop, thu2_1012_malop, thu2_1315_malop,
            thu3_13_malop, thu3_46_malop, thu3_79_malop, thu3_1012_malop, thu3_1315_malop,
            thu4_13_malop, thu4_46_malop, thu4_79_malop, thu4_1012_malop, thu4_1315_malop,
            thu5_13_malop, thu5_46_malop, thu5_79_malop, thu5_1012_malop, thu5_1315_malop,
            thu6_13_malop, thu6_46_malop, thu6_79_malop, thu6_1012_malop, thu6_1315_malop,
            thu7_13_malop, thu7_46_malop, thu7_79_malop, thu7_1012_malop, thu7_1315_malop,
            chunhat_13_malop, chunhat_46_malop, chunhat_79_malop, chunhat_1012_malop, chunhat_1315_malop,

            thu2_13_nhom, thu2_46_nhom, thu2_79_nhom, thu2_1012_nhom, thu2_1315_nhom,
            thu3_13_nhom, thu3_46_nhom, thu3_79_nhom, thu3_1012_nhom, thu3_1315_nhom,
            thu4_13_nhom, thu4_46_nhom, thu4_79_nhom, thu4_1012_nhom, thu4_1315_nhom,
            thu5_13_nhom, thu5_46_nhom, thu5_79_nhom, thu5_1012_nhom, thu5_1315_nhom,
            thu6_13_nhom, thu6_46_nhom, thu6_79_nhom, thu6_1012_nhom, thu6_1315_nhom,
            thu7_13_nhom, thu7_46_nhom, thu7_79_nhom, thu7_1012_nhom, thu7_1315_nhom,
            chunhat_13_nhom, chunhat_46_nhom, chunhat_79_nhom, chunhat_1012_nhom, chunhat_1315_nhom,

            thu2_13_tenmon, thu2_46_tenmon, thu2_79_tenmon, thu2_1012_tenmon, thu2_1315_tenmon,
            thu3_13_tenmon, thu3_46_tenmon, thu3_79_tenmon, thu3_1012_tenmon, thu3_1315_tenmon,
            thu4_13_tenmon, thu4_46_tenmon, thu4_79_tenmon, thu4_1012_tenmon, thu4_1315_tenmon,
            thu5_13_tenmon, thu5_46_tenmon, thu5_79_tenmon, thu5_1012_tenmon, thu5_1315_tenmon,
            thu6_13_tenmon, thu6_46_tenmon, thu6_79_tenmon, thu6_1012_tenmon, thu6_1315_tenmon,
            thu7_13_tenmon, thu7_46_tenmon, thu7_79_tenmon, thu7_1012_tenmon, thu7_1315_tenmon,
            chunhat_13_tenmon, chunhat_46_tenmon, chunhat_79_tenmon, chunhat_1012_tenmon, chunhat_1315_tenmon,

            thu2_13_gv, thu2_46_gv, thu2_79_gv, thu2_1012_gv, thu2_1315_gv,
            thu3_13_gv, thu3_46_gv, thu3_79_gv, thu3_1012_gv, thu3_1315_gv,
            thu4_13_gv, thu4_46_gv, thu4_79_gv, thu4_1012_gv, thu4_1315_gv,
            thu5_13_gv, thu5_46_gv, thu5_79_gv, thu5_1012_gv, thu5_1315_gv,
            thu6_13_gv, thu6_46_gv, thu6_79_gv, thu6_1012_gv, thu6_1315_gv,
            thu7_13_gv, thu7_46_gv, thu7_79_gv, thu7_1012_gv, thu7_1315_gv,
            chunhat_13_gv, chunhat_46_gv, chunhat_79_gv, chunhat_1012_gv, chunhat_1315_gv,


        });


    });
   

};

module.exports.xemketquahoctap = function(req, res){
    const { cookies } = req;
   // console.log(cookies.mssv);
    var mssv = cookies.mssv;
    var list;
    database.layketquahoctapchosinhvien(mssv, function (listkq) {
        list =listkq;
        return res.render('./bodySinhVien/GD_SV_xemkqht',
                            {layout: './layouts/layoutSinhVien' , 
                            title: 'Xem kết quả học tập',  list:listkq});
    });
   
   
   
};







