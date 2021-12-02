var database = require("../database");

module.exports.trangnhapdiem = function (req, res) {
    database.nvnhapdiemlaymalop(function (listma) {
        return res.render('./bodyNhanVien/GV_NV_Nhapdiem',{layout: './layouts/layoutNhanVien' , title: 'Giao Dien Nhập Điểm',listma:listma,dssv:0});
    });
};


module.exports.locdssv = function (req, res) {
    var lhp = req.query.lhpsv;
    // console.log(lhp);
    database.nvnhapdiemlaymalop(function (listma) {
        database.nvnhapdiemlaydssv(lhp,function (dssv) {
            return res.render('./bodyNhanVien/GV_NV_Nhapdiem',{layout: './layouts/layoutNhanVien' , title: 'Giao Dien Nhập Điểm',listma:listma,dssv:dssv});
        });
    });
    
};

module.exports.chuyendentrangsuadiem = function (req, res) {
    var massv = req.params.masv;
    var malop = req.params.malop;
    database.nvnhapdiemlaysv(massv,malop,function (sv) {
        return res.render('./bodyKhongMenu/GD_NV_From_NhapDiem', { layout: './layouts/layoutKhongMenu', title: 'Giao dien nhap diem',sv:sv[0]});
    });  
};

module.exports.luudiem = function (req, res) {
    var diemtk = req.body.diemtk;
    var diemgk = req.body.diemgk;
    var diemth = req.body.diemth;
    var diemck = req.body.diemck;
    var masv = req.body.masv;
    var malop = req.body.malop;
    database.nvnhapdiemcapnhatdiem(diemtk,diemgk,diemth,diemck,masv,malop,function (results) {
        res.redirect('/nhanvien/nhapdiem');
    });
};