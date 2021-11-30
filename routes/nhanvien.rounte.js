const { Connect } = require('aws-sdk');

const expressLayouts = require('express-ejs-layouts');
var express = require('express');
const multer = require('multer');
const upload = multer();

const controllersv = require('../controller/sinhvien.controller');
const controllerkhoa = require('../controller/nhanvienkhoa.controller');
const controllerchuyennganh = require('../controller/NhanVienChuyenNganh.controller');
const controllerlh = require('../controller/lichhoc.controller');
const controllercn = require('../controller/chiachuyennganh.controller');
const controllerchcckh = require('../controller/chuongtrkh.controller');
const controllerlhp = require('../controller/NhanVienLHP.controller');
const controllermhp = require('../controller/nhanvienmhp.controller');
const controllergv = require('../controller/nhanvien.giangvien.controller');
const controllernamhoc = require('../controller/NhanVienNamHoc.controller');
const controllerphonghoc = require('../controller/NhanVienPhongHoc.controller');
const controllerhocky = require('../controller/NhanVienHocKy.controller');


var database = require("../database");
var router = express.Router();
router.use(express.json({ extended: false }));
router.use(express.static('../views'));
router.use(expressLayouts);

//Nhân Viên
router.get('/trangchu',controllersv.trangchunv );


//Nhân viên cập nhật chuyên ngành
router.get('/cnchuyennganh',controllerchuyennganh.trangcapnhatchuyennganh);
router.get('/cnchuyennganh/add-chuyennganh',controllerchuyennganh.chuyenaddchuyennganh);
router.get('/cnchuyennganh/deletechuyennganh/:chuyennganhid',controllerchuyennganh.xoachuyennganh);
router.get('/cnchuyennganh/editchuyennganh/:chuyennganhid', controllerchuyennganh.chuyeneditchuyennganh);
router.get('/cnchuyennganh/timchuyennganh',upload.fields([]), controllerchuyennganh.timkiemchuyennganh);
router.get('/cnchuyennganh/savedatachuyennganh', upload.fields([]),controllerchuyennganh.savedataChuyenNganh);
router.get('/cnchuyennganh/lockhoa', controllerchuyennganh.lockhoa);

router.post('/cnchuyennganh/save_chuyennganh', upload.fields([]),controllerchuyennganh.luuchuyennganh);
router.post('/cnchuyennganh/update_chuyennganh', upload.fields([]), controllerchuyennganh.capnhatchuyennganh);
router.post('/cnchuyennganh/uploadfileChuyenNganh', controllerchuyennganh.uploadfileChuyenNganh);

//Nhân viên cập nhật khoa
router.get('/cnkhoa',controllerkhoa.trangcapnhatkhoa);
router.get('/cnkhoa/add-khoa', controllerkhoa.chuyennhapkhoa);
router.get('/cnkhoa/deletekhoa/:khoaid',controllerkhoa.xoakhoa);
router.get('/cnkhoa/editkhoa/:khoaid', controllerkhoa.chuyeneditkhoa);
router.get('/cnkhoa/timkhoa',upload.fields([]), controllerkhoa.timkiemkhoa);
router.get('/cnkhoa/savedatakhoa', upload.fields([]),controllerkhoa.savedatakhoa);

router.post('/cnkhoa/save_khoa', upload.fields([]),controllerkhoa.luukhoa);
router.post('/cnkhoa/update_khoa', upload.fields([]), controllerkhoa.capnhatkhoa);
router.post('/cnkhoa/uploadfileKhoa', controllerkhoa.uploadfilekhoa);

//Nhân viên cập nhật môn học phần
router.get('/cnmonhp',controllermhp.trangcapnhatmhp);
router.get('/cnmonhp/add-monhp', controllermhp.chuyennhapkhoa);
router.get('/cnmonhp/deletemonhp/:monhpid', controllermhp.xoamonhp);
router.get('/cnmonhp/editmonhp/:monhpid', controllermhp.chuyeneditmonhp);
router.get('/cnmonhp/timmonhp', upload.fields([]),controllermhp.timkiemmhp);
router.get('/cnmonhp/savedatamonhp', upload.fields([]),controllermhp.savedatamonhp);
router.get('/cnmonhp/lockhoa', controllermhp.lockhoamh);

router.post('/cnmonhp/save_mhp', upload.fields([]),controllermhp.luumhp);
router.post('/cnmonhp/update_mhp', upload.fields([]), controllermhp.capnhatmhp);
router.post('/cnmonhp/uploadfileMonHP', controllermhp.uploadfilemonhp);

//Nhân viên cập nhật lớp học phần
router.get('/cnlophp',controllerlhp.trangcapnhatlhp);
router.get('/cnlophp/add-lhp', controllerlhp.chuyennhaplhp);
router.get('/cnlophp/deletelophp/:lophpid', controllerlhp.xoalophp);
router.get('/cnlophp/editlophp/:lophpid', controllerlhp.chuyeneditlophp);
router.get('/cnlophp/timlophp', upload.fields([]),controllerlhp.timkiemlophp);
router.get('/cnlophp/savedatalophp', upload.fields([]),controllerlhp.savedataLopHP);
router.get('/cnlophp/locmhp', controllerlhp.locmhp);

router.post('/cnlophp/save_lophp', upload.fields([]),controllerlhp.luulhp);
router.post('/cnlophp/update_lhp', upload.fields([]), controllerlhp.capnhatlophp);
router.post('/cnlophp/uploadfileLopHP', controllerlhp.uploadfileLopHP);

//Nhân viên cập nhật sinh viên
router.get('/cnsinhvien',controllersv.trangcapnhatsv );
router.get('/cnsinhvien/add-sv', controllersv.chuyennhapsv);
router.get('/cnsinhvien/editsv/:svid', controllersv.chuyenedit);
router.get('/cnsinhvien/deletesv/:svid', controllersv.xoasv);
router.post('/cnsinhvien/save_sv', upload.fields([]), controllersv.luusv);
router.post('/cnsinhvien/update_sv', upload.fields([]), controllersv.capnhatsv);
router.post('/cnsinhvien/uploadfileSV', controllersv.uploadfile);
router.get('/cnsinhvien/savedata', upload.fields([]),controllersv.savedata);
router.get('/cnsinhvien/timsv', upload.fields([]),controllersv.timkiemsv);
//<<<<<<< HEAD
router.get('/cnsinhvien/lockq',controllersv.lockqkh );


//Nhân viên cập nhật giảng viên
router.get('/cngiangvien',controllergv.trangcapnhatgv );
router.get('/cngiangvien/add-gv', controllergv.chuyennhapgv);
router.get('/cngiangvien/editgv/:gvid', controllergv.chuyeneditgv);
router.get('/cngiangvien/deletegv/:gvid', controllergv.xoagv);
router.get('/cngiangvien/timgv', upload.fields([]),controllergv.timkiemgv);
router.get('/cngiangvien/savedatagv', upload.fields([]),controllergv.savedataGV);
router.get('/cngiangvien/lockhoa', controllergv.lockhoagv);

router.post('/cngiangvien/save_giangvien', upload.fields([]), controllergv.luugv);
router.post('/cngiangvien/update_giangvien', upload.fields([]), controllergv.capnhatgv);
router.post('/cngiangvien/uploadfileGV', controllergv.uploadfileGV);

//Nhân viên cập nhật năm học
router.get('/cnnamhoc', controllernamhoc.trangcapnhatNamHoc);
router.get('/cnnamhoc/add-namhoc', controllernamhoc.chuyennhapNamHoc);
router.get('/cnnamhoc/deletenamhoc/:nam', controllernamhoc.xoaNamHoc);
router.get('/cnnamhoc/timnamhoc', upload.fields([]),controllernamhoc.timkiemNamHoc)

router.post('/cnnamhoc/save_namhoc', upload.fields([]), controllernamhoc.luuNamHoc);

//Nhân viên cập nhật phòng học
router.get('/cnphonghoc', controllerphonghoc.trangcapnhatPhongHoc);
router.get('/cnphonghoc/add-phonghoc', controllerphonghoc.chuyennhapPhongHoc);
router.get('/cnphonghoc/deletephonghoc/:phonghoc', controllerphonghoc.xoaPhongHoc);
router.get('/cnphonghoc/timphonghoc', upload.fields([]),controllerphonghoc.timkiemPhongHoc)

router.post('/cnphonghoc/save_phonghoc', upload.fields([]), controllerphonghoc.luuPhongHoc);

//Nhân viên cập nhật học kỳ
router.get('/cnhocky', controllerhocky.trangcapnhatHocKy);
router.get('/cnhocky/add-hocky', controllerhocky.chuyennhapHocKy);
router.get('/cnhocky/deletehocky/:hocky', controllerhocky.xoaHocKy);

router.post('/cnhocky/save_hocky', upload.fields([]), controllerhocky.luuHocKy);
//>>>>>>> TienBranch

//Nhân viên xếp lịch học
router.get('/xeplichhoc', controllerlh.trangxeplich);
router.get('/xeplichhoc/timlhp',upload.fields([]), controllerlh.timlhp);
router.get('/xeplichhoc/xoalich/:manhom&:malop', controllerlh.xoalichhoc);
router.post('/xeplichhoc/uploadfilelh', controllerlh.uploadfile);
router.get('/xeplichhoc/savedata', upload.fields([]),controllerlh.savedata);
router.get('/xeplichhoc/lockq', controllerlh.lockqlh);
// router.get('/xeplichhoc/xlkiemtradl', upload.fields([]),controllerlh.xlkiemtraduleu);
//Nhân viên chia chuyên ngành
router.get('/chiachuyennganh', controllercn.trangchiacn);
router.get('/chiachuyennganh/lockq', controllercn.lockqcn);
router.get('/chiachuyennganh/deletesvng/:svid', controllercn.xoasvkhcn);
router.post('/chiachuyennganh/uploadfilesvcn', controllercn.uploadfilesvcn);
router.get('/chiachuyennganh/savedata', upload.fields([]),controllercn.savedata);
router.get('/chiachuyennganh/timsv',upload.fields([]), controllercn.timsvcn);


//nhân viên chia chương trình khung
router.get('/xepkhung', controllerchcckh.trangxepkhung);
router.get('/xepkhung/lockq', controllerchcckh.lockq);
router.get('/xepkhung/deletemhp/:mhid', controllerchcckh.xoamhkhcn);
router.post('/xepkhung/uploadfilemhcn', controllerchcckh.uploadfilemhcn);
router.get('/xepkhung/savedata', upload.fields([]),controllerchcckh.savedata);



router.get('/cngiangvien', (req, res) => {
   // return res.render('CNGiangVien');
    return res.render('./bodyNhanVien/CNGiangVien',{layout: './layouts/layoutNhanVien' , title: 'Cập Nhật Giảng Viên'});
});

router.get('/cnmonhp', (req, res) => {
   // return res.render('CNMonHocPhan');
    return res.render('./bodyNhanVien/CNMonHocPhan',{layout: './layouts/layoutNhanVien' , title: 'Cập Nhật Môn Học Phần'});
});

router.get('/cnlophp', (req, res) => {
    //return res.render('CNLopHP');
    return res.render('./bodyNhanVien/CNLopHP',{layout: './layouts/layoutNhanVien' , title: 'Cập Nhật Lớp Học Phần'});
});

router.get('/cnnamhoc', (req, res) => {
    return res.render('./bodyNhanVien/CNNamHoc',{layout: './layouts/layoutNhanVien' , title: 'Cập Nhật Năm Học'});
});

router.get('/cnhocky', (req, res) => {
    return res.render('./bodyNhanVien/CNHocKi',{layout: './layouts/layoutNhanVien' , title: 'Cập Nhật Học Kì'});
});

router.get('/cnphonghoc', (req, res) => {
    return res.render('./bodyNhanVien/CNPhongHoc',{layout: './layouts/layoutNhanVien' , title: 'Cập Nhật Phòng Học'});
});





router.get('/trangchuNV', (req, res) => {
    return res.render('./bodyNhanVien/GD_NV_TrangChu',{layout: './layouts/layoutNhanVien' , title: 'Trang Chủ Nhân Viên'});
});



router.get('/timsv', (req, res) => {
    return res.render('./bodyNhanVien/TimKiemSV',{layout: './layouts/layoutNhanVien' , title:'Tìm Kiếm Sinh Viên'});
});

router.get('/timgv', (req, res) => {
    return res.render('./bodyNhanVien/TimKiemGV',{layout: './layouts/layoutNhanVien' , title: 'Tìm Kiếm Giảng Viên'});
});
router.get('/timmonhp', (req, res) => {
    return res.render('./bodyNhanVien/TimKiemMHP',{layout: './layouts/layoutNhanVien' , title: 'Tìm Kiếm Môn Học Phần'});
});



module.exports = router;