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

var upload1 = multer({ storage: storage }).single('myfilechuyennganh');


module.exports.trangcapnhatchuyennganh = function (req, res) {
    
    database.getAllChuyenNganh(function (result) {
        res.render('./bodyNhanVien/CNChuyenNganh', { layout: './layouts/layoutNhanVien', title: 'Cập Nhật Chuyên Ngành', listchuyennganh : result});
    })
};

module.exports.chuyenaddchuyennganh = function(req,res){
    return res.render('./bodyKhongMenu/GD_NV_Form_Add_ChuyenNganh', { layout: './layouts/layoutKhongMenu', title: 'Thêm chuyên ngành' });
}

module.exports.luuchuyennganh = function(req,res){
    console.log(req.body);
        let data = {
            MaChuyenNganh: req.body.machuyennganh, MaKhoa: req.body.makhoa, TenChuyenNganh: req.body.tenchuyennganh
        };
        database.themChuyenNganh(data, function(results){
            res.redirect('/nhanvien/cnchuyennganh');
        });
};

module.exports.xoachuyennganh = function (req, res) {
    const chuyennganhid = req.params.chuyennganhid;
        database.xoaChuyenNganh(chuyennganhid, function(results){
            res.redirect('/nhanvien/cnchuyennganh');
        });
};

module.exports.chuyeneditchuyennganh = function (req, res) {
    const chuyennganhid = req.params.chuyennganhid;
    database.chuyenDenUpdateChuyenNganh(chuyennganhid, function (results) {
        console.log(results[0]);
        // res.render('GD_NV_From_Update_Khoa', { sv: results[0] });
        return res.render('./bodyKhongMenu/GD_NV_Form_Update_ChuyenNganh', { layout: './layouts/layoutKhongMenu', title: 'Cập nhật chuyên ngành', chuyennganh: results[0] });
    });
};

module.exports.capnhatchuyennganh = function(req,res){
    const machuyennganh = req.body.machuyennganh;
    const makhoa = req.body.makhoa;
    const tenchuyennganh = req.body.tenchuyennganh;

    database.updateChuyenNganh(tenchuyennganh,machuyennganh,function (results){
        res.redirect('/nhanvien/cnchuyennganh');
    });
};

module.exports.timkiemchuyennganh = function (req, res) {
    var query = req.query.tukhoachuyennganh;
    console.log(query);
    database.timkiemChuyenNganh(query, function (results) {
        if (results.length > 0) {
            res.render('./bodyNhanVien/CNChuyenNganh', { layout: './layouts/layoutNhanVien', title: 'Cập Nhật chuyên ngành', listchuyennganh: results });
        } else {
            database.getAllChuyenNganh(function (result) {
                res.render('./bodyNhanVien/CNChuyenNganh', { layout: './layouts/layoutNhanVien', title: 'Cập Nhật chuyên ngành', listchuyennganh: result });
            });
        }

    });
};
module.exports.uploadfileChuyenNganh = function (req, res) {
    upload1(req, res, function (err) {
        if (err) {
            return res.end('Error uploading file');
        }
        res.end('File is uploaded successfully');
    });
};

module.exports.savedataChuyenNganh = function (req, res) {
    const schema = {
        'Mã chuyên ngành': {
            prop: 'MaChuyenNganh',
            type: String
        },
        'Tên chuyên ngành': {
            prop: 'TenChuyenNganh',
            type: String
        },
        'Mã khoa': {
            prop: 'MaKhoa',
            type: String
        },
    };

    readXlsxFile('./file/datachuyennganh.xlsx', { schema }).then(({ rows, errors }) => {
        errors.length === 0;
        //console.log(rows);
        for (let i = 0; i < rows.length; i++) {
            // console.log(rows);   
            let data = {
                MaChuyenNganh: rows[i].MaChuyenNganh, TenChuyenNganh: rows[i].TenChuyenNganh, MaKhoa: rows[i].MaKhoa, 
            };
            database.themChuyenNganh(data, function (results) {
                
            });

        };
         res.redirect('/nhanvien/cnchuyennganh');
    });

};
