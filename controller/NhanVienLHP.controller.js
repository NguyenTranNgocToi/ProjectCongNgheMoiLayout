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

var upload1 = multer({ storage: storage }).single('myfilelophp');

module.exports.trangcapnhatlhp = function (req, res) {
    
    database.getAllLHP(function (result) {
        res.render('./bodyNhanVien/CNLopHP', { layout: './layouts/layoutNhanVien', title: 'Cập Nhật Lớp Học Phần', listlophp : result});
    })
};

module.exports.chuyennhaplhp = function (req, res) {
    return res.render('./bodyKhongMenu/GD_NV_Form_Add_LHP', { layout: './layouts/layoutKhongMenu', title: 'Thêm Lớp Học Phần' });
};

module.exports.luulhp = function(req,res){
    console.log(req.body);
        let data = {
            MaLopHP: req.body.malophp, SiSo: req.body.siso,MaMHP: req.body.mamhp, Nam: req.body.nam, HocKy: req.body.hocky, DaDangKy: req.body.dadangky
        };
        database.themLHP(data, function(results){
            res.redirect('/nhanvien/cnlophp');
        });
};

module.exports.xoalophp = function (req, res) {
    const lophpid = req.params.lophpid;
        database.xoaLHP(lophpid, function(results){
            res.redirect('/nhanvien/cnlophp');
        });
};

module.exports.chuyeneditlophp = function (req, res) {
    const lophpid = req.params.lophpid;
    database.chuyenDenUpdateLHP(lophpid, function (results) {
        console.log(results[0]);
        return res.render('./bodyKhongMenu/GD_NV_Form_UpdateLHP', { layout: './layouts/layoutKhongMenu', title: 'Cập nhật lớp học phần', lophp: results[0] });
    });
};

module.exports.capnhatlophp = function(req,res){
    const malophp = req.body.malophp;
    const siso = req.body.siso;
    const mamhp = req.body.mamhp;
    const nam = req.body.nam;
    const hocky = req.body.hocky;
    const dadangky = req.body.dadangky;

    database.updateLHP(siso,mamhp,nam,hocky,dadangky,malophp,function (results){
        res.redirect('/nhanvien/cnlophp');
    });
};

module.exports.timkiemlophp = function (req, res) {
    var query = req.query.tukhoalophp;
    console.log(query);
    database.timkiemlhp(query, function (results) {
        if (results.length > 0) {
            res.render('./bodyNhanVien/CNLopHP', { layout: './layouts/layoutNhanVien', title: 'Cập Nhật Lớp Học Phần', listlophp: results });
        } else {
            database.getAllLHP(function (result) {
                res.render('./bodyNhanVien/CNLopHP', { layout: './layouts/layoutNhanVien', title: 'Cập Nhật Lớp Học Phần', listlophp: result });
            });
        }

    });
};

module.exports.uploadfileLopHP = function (req, res) {
    upload1(req, res, function (err) {
        if (err) {
            return res.end('Error uploading file');
        }
        res.end('File is uploaded successfully');
    });
};

module.exports.savedataLopHP = function (req, res) {
    const schema = {
        'Mã lớp học phần': {
            prop: 'MaLopHP',
            type: String
        },
        'Sỉ số': {
            prop: 'SiSo',
            type: String
        },
        'Mã môn học phần': {
            prop: 'MaMHP',
            type: String
        },
        'Năm': {
            prop: 'Nam',
            type: String
        },
        'Học Kỳ': {
            prop: 'HocKy',
            type: String
        },
        'Đã đăng ký': {
            prop: 'DaDangKy',
            type: String
        },
    };
    var arr = new Array();
    readXlsxFile('./file/datalophocphan.xlsx', { schema }).then(({ rows, errors }) => {
        for (let i = 0; i < rows.length; i++) {
            let lhp = rows[i].MaLopHP;
            arr.push(lhp);

        };
        database.lhpkiemtradulieu(arr,function (results) {
            if(results.length > 0)
            {
                res.send({ message: 'Lớp học phần có mã'+ '\t' + results[0].MaLopHP + '\t' + 'đã tồn tại'});
            }else{
                for (let a = 0; a < rows.length; a++) {
                    let data = {
                        MaLopHP: rows[a].MaLopHP, SiSo: rows[a].SiSo, MaMHP: rows[a].MaMHP, Nam: rows[a].Nam, HocKy: rows[a].HocKy, DaDangKy: rows[a].DaDangKy
                    };
                    database.themLHP(data, function (results) {
                        
                    });
        
                };
                res.send({ message: 'Đã thêm' });
            }
        });
       
    });

};
