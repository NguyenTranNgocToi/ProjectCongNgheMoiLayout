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
    var mess="";
    var mess1="";
    var mess2="";
    console.log("mã th:"+manhomth);
    console.log("mã lt:"+manhomlt);
    console.log("mã lớp đã chọn để hủy:"+chonlophocdadangky);

    if(chonlophocdadangky!=""){
        database.huydangkyhocphanchosinhvien(mssv,chonlophocdadangky);
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
                                                            }else{
                                                                mess2="Đăng ký thành công"
                                                                database.dangkyhocphanchosinhvien(mssv,malophoc,manhomlt);
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
                                                    
                                                    })
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
                                                        } 
                                                        console.log("mess21"+mess2);
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
                                                        });
                                                    
                                                }
        

                                            })
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







