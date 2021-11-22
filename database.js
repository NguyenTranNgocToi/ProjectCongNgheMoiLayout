//NTNT ket noi my sql
var mysql = require('mysql');
var connection = mysql.createConnection({
    //local

    host:'localhost',
    user:'root',
    password:'123456',
    database:'sqlquanlyhocphan'

    //phải có dòng này trong mysql local, còn trên aws không cần
    //alter user 'root'@'localhost' identified with mysql_native_password by 'sapassword'

    //aws
    // host:'database-quanlyhocphan.cghxoveoeumb.ap-southeast-1.rds.amazonaws.com',
    // user:'sa',
    // password:'sapassword',
    // database:'sqlquanlyhocphan'   
});
var connect = function(){
    connection.connect(function(err){
        if(!err){
            console.log("connected");
        }else{
            console.log("error kết nối lần 2");
        }
    })
}
var closeDB = function(){
    connection.end(function(err){
        if(!err){
            console.log("close");
        }else{
            console.log("error cloes");
        } 
    })
}


// lay ds nam

exports.getdsNam = function(callbackQuery){
    connect();
    connection.query("SELECT * FROM nam", function(err, results,fields){
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
           
        }
    })  
};
// lấy mật khẩu sv ntnt
exports.getPassSV = function(MSSV,callbackQuery){
    connect();
    connection.query("SELECT Pass FROM taikhoansv where MaTaiKhoan =? ",[MSSV], function(err, results,fields){
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    })
    //closeDB();
};

//lấy mật khẩu nv ntnt
exports.getPassNV = function(MSNV,callbackQuery){
    connect();
    connection.query("SELECT Pass FROM taikhoannv where MaTaiKhoan = ?",[MSNV], function(err, results,fields){
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    })
    //closeDB();
};

/*
    Bắt đầu xử lý cho giao diện sinh viên
*/

// Lấy dữ liệu từ bảng sinh viên ntnt
exports.getAllSV = function(callbackQuery){
    connect();// order by MSSV DESC limit 5
    connection.query("SELECT * FROM sinhvien", function(err, results,fields){
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
           
        }
    })  
    //closeDB();
}
//Thêm sinh viên
exports.themSV = function(data,callbackQuery){
    connect();
    connection.query("Insert into sinhvien Set ? ",[data],(err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    });  
};
exports.themtaikhoansv = function(tk,callbackQuery){
    connect();
    connection.query("Insert into taikhoansv Set ?",[tk],(err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    });
}
// Xóa sinh viên
exports.xoaSV = function(masv,callbackQuery){
    connect();
    connection.query("Delete from sinhvien where MSSV = ?",[masv],(err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    })  
};
//Xóa tài khoản sinh viên
exports.xoatksv = function(masv,callbackQuery){
    connect();
    connection.query("Delete from taikhoansv where MaTaiKhoan = ?",[masv],(err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    })  
};
//Chuyển đến trang cập nhật
exports.chuyenDenUpdate = function(masv,callbackQuery){
    connect();
    connection.query("Select * from sinhvien where MSSV = ?",[masv],(err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    })  
};

exports.updateSV = function(masv,hoten,gioitinh,ns,diachi,dienthoai,khoahoc,callbackQuery){
    connect();
    connection.query("update sinhvien set DiaChi = ?, GioiTinh = ?, HoTen = ?, NgaySinh = ?, SoDT = ?, KhoaHoc = ? where MSSV = ?",
    [diachi,gioitinh,hoten,ns,dienthoai,khoahoc,masv],(err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    }) 
};
// lấy thông tin cá nhân sinh viên ntnt
exports.getTTCNSV = function(MSSV,callbackQuery){
    connect();// order by MSSV DESC limit 5
    connection.query("SELECT * FROM sqlquanlyhocphan.sinhvien where MSSV = ?",[MSSV], function(err, results,fields){
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
        }
    })  
    //closeDB();
}

exports.timkiemsv = function(tukhoa,callbackQuery){
    connect();//or DiaChi like N'%"+tukhoa+"%'
    connection.query("Select * from sinhvien where Hoten like N'%"+tukhoa+"%' or MSSV like N'%"+tukhoa+"%' limit 10",
    (err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    }) 
};

exports.kiemtradl = function(masv,callbackQuery){
    connect();
    connection.query("SELECT * FROM sinhvien where MSSV = ?",[masv],
    (err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    }) 
};
exports.laysvtheokh = function(khoahoc,callbackQuery){
    connect();
    connection.query("SELECT * FROM sinhvien where KhoaHoc = ?",[khoahoc],
    (err,results)=>{
        if(!err){
            callbackQuery(results);}
    })}

//update pass tk sinh viên ntnt
exports.updatematkhausv = function(masv,pass,callbackQuery){
    connect();
    connection.query("UPDATE taikhoansv SET Pass = ? WHERE (MaTaiKhoan = ?)",
    [pass,masv],(err,results)=>{
        if(!err){
            //callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    }) 
};

//xem chương trình khung 
exports.xemchuongtrinhkhung = function(MSSV,callbackQuery){
    connect();// order by MSSV DESC limit 5
    connection.query("select chuyennganh.TenChuyenNganh,monhocphan.MaMHP,monhocphan.TenMHHP , chuongtrinhkhung.HocKy from sinhvien_thuoc_nganh inner join chuongtrinhkhung on sinhvien_thuoc_nganh.MaChuyenNganh  = chuongtrinhkhung.MachuyenNganh inner join monhocphan on monhocphan.MaMHP  = chuongtrinhkhung.MaMHP inner join chuyennganh on chuyennganh.MaChuyenNganh = sinhvien_thuoc_nganh.MaChuyenNganh where sinhvien_thuoc_nganh.MSSV = ? order by  chuongtrinhkhung.HocKy asc",[MSSV], function(err, results,fields){
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
        }
    })  
    //closeDB();
}
//lấy danh sách môn học phần cho sinh viên đang ký
exports.laydanhsachmonhocphanchosinhvien = function(MSSV,HocKy,Nam,callbackQuery){
    connect();// order by MSSV DESC limit 5
    connection.query("select monhocphan.* from sinhvien_thuoc_nganh inner join chuongtrinhkhung on sinhvien_thuoc_nganh.MaChuyenNganh  = chuongtrinhkhung.MachuyenNganh inner join lophocphan on lophocphan.MaMHP = chuongtrinhkhung.MaMHP inner join monhocphan on monhocphan.MaMHP = lophocphan.MaMHP where sinhvien_thuoc_nganh.MSSV = ? and lophocphan.HocKy =? and lophocphan.Nam =? GROUP BY lophocphan.MaMHP",[MSSV,HocKy,Nam], function(err, results,fields){
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
        }
    })  
    //closeDB();
}
//lấy danh sách lớp học phần cho sinh viên
exports.laydanhsachlophocphanchosinhvien = function(MaLopHP,callbackQuery){
    connect();// order by MSSV DESC limit 5
    connection.query(" select lophocphan.* from lophocphan where lophocphan.MaMHP =?",[MaLopHP], function(err, results,fields){
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
        }
    })  
    //closeDB();
}


/*
    Kết thúc xử lý cho giao diện sinh viên
*/

/*
    Bắt đầu xử lý cho giao diện Khoa
*/

// Lấy dữ liệu từ bảng khoa
exports.getAllKhoa = function(callbackQuery){
    connect();
    connection.query("SELECT * FROM khoa order by MaKhoa", function(err, results,fields){
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
        }
    })  
    //closeDB();
}
//Thêm khoa
exports.themKhoa = function(data,callbackQuery){
    connect();
    connection.query("Insert into khoa Set ? ",[data],(err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    });  
};

//Xóa khoa
exports.xoaKhoa = function(makhoa,callbackQuery){
    connect();
    connection.query("Delete from khoa where MaKhoa = ?",[makhoa],(err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    })  
};

//Cập nhật lại khoa
exports.chuyenDenUpdateKhoa = function(makhoa,callbackQuery){
    connect();
    connection.query("Select * from khoa where MaKhoa = ?",[makhoa],(err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    })  
};

exports.updateKhoa = function(makhoa,tenkhoa,callbackQuery){
    connect();
    connection.query("update khoa set tenkhoa = ? where MaKhoa = ?",
    [tenkhoa,makhoa],(err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    }) 
}

exports.timkiemkhoa = function(tukhoakhoa,callbackQuery){
    connect();
    connection.query("Select * from khoa where MaKhoa like N'%"+tukhoakhoa+"%' or TenKhoa like N'%"+tukhoakhoa+"%' limit 10",
    (err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    }) 
}
/*
    Kết thúc xử lý cho giao diện khoa
*/

/*
    Bắt đầu xử lý cho giao diện chuyên ngành
*/

// Lấy dữ liệu từ bảng khoa
exports.getAllChuyenNganh = function(callbackQuery){
    connect();
    connection.query("SELECT * FROM chuyennganh order by MaChuyenNganh", function(err, results,fields){
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
        }
    })  
    //closeDB();
};
//Thêm chuyên ngành
exports.themChuyenNganh = function(data,callbackQuery){
    connect();
    connection.query("Insert into chuyennganh Set ? ",[data],(err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    });  
};

//Xóa chuyên ngành
exports.xoaChuyenNganh = function(machuyennganh,callbackQuery){
    connect();
    connection.query("Delete from chuyennganh where MaChuyenNganh = ?",[machuyennganh],(err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    })  
};

//Cập nhật lại chuyên ngành
exports.chuyenDenUpdateChuyenNganh = function(machuyennganh,callbackQuery){
    connect();
    connection.query("Select * from chuyennganh where MaChuyenNganh = ?",[machuyennganh],(err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    })  
};

exports.updateChuyenNganh = function(tenchuyennganh,machuyennganh,callbackQuery){
    connect();
    connection.query("update chuyennganh set TenChuyenNganh = ? where MaChuyenNganh = ?",
    [tenchuyennganh,machuyennganh],(err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    }) 
}

exports.timkiemChuyenNganh = function(tukhoachuyennganh,callbackQuery){
    connect();
    connection.query("Select * from chuyennganh where MaKhoa like N'%"+tukhoachuyennganh+"%' or TenChuyenNganh like N'%"+tukhoachuyennganh+"%' or MaChuyenNganh like N'%"+tukhoachuyennganh+"%' limit 10",
    (err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    }) 
}
/*
    Kết thúc xử lý cho giao diện chuyên ngành
*/


/*
    Xử lý giao diện xếp lịch
*/

exports.laylichhoc = function(callbackQuery){
    connect();
    connection.query("SELECT * FROM thoigian_phonghoc_giangvien",
    (err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    }) 
};

exports.timlophplh = function(malophp,callbackQuery){
    connect();
    connection.query("SELECT * FROM thoigian_phonghoc_giangvien where MaLopHP = ?",[malophp],
    (err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    }) 
};

exports.xoalichhoc = function(malophp,manhom,callbackQuery){
    connect();
    connection.query("DELETE FROM thoigian_phonghoc_giangvien where MaLopHP = ? and MaNhom = ?",[malophp,manhom],
    (err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    }) 
};

exports.themlichhoc = function(data,callbackQuery){
    connect();
    connection.query("Insert into thoigian_phonghoc_giangvien Set ?",[data],
    (err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    }) 
};

exports.nvloclichhoc = function(nh,hk,callbackQuery){
    connect();
    connection.query("select thoigian_phonghoc_giangvien.* from lophocphan INNER JOIN thoigian_phonghoc_giangvien on lophocphan.MaLopHP =  thoigian_phonghoc_giangvien.MaLopHP where lophocphan.HocKy = ? and  lophocphan.Nam =?",[hk,nh],
    (err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    }) 
};



/*
   Kết thúc xử lý giao diện xếp lịch
*/

/*
    Xử lý giao diện chia chuyên ngành
*/

exports.laymachuyennganh = function(callbackQuery){
    connect();
    connection.query("Select MaChuyenNganh from chuyennganh",
    (err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    }) 
};

exports.laysvtheocn = function(data,callbackQuery){
    connect();
    connection.query("SELECT sv.* FROM sinhvien sv join sinhvien_thuoc_nganh svn on sv.MSSV = svn.MSSV where svn.MaChuyenNganh = ?",[data],
    (err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    }) 
};

exports.xoaSVKCN = function(data,callbackQuery){
    connect();
    connection.query("Delete from sinhvien_thuoc_nganh where MSSV = ?",[data],
    (err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    }) 
};

exports.themCNSV = function(data,callbackQuery){
    connect();
    connection.query("Insert into sinhvien_thuoc_nganh Set ?",[data],
    (err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    }) 
};

exports.timsvtrongcn = function(masv,callbackQuery){
    connect();
    connection.query("SELECT sv.* FROM sinhvien sv join sinhvien_thuoc_nganh svn on sv.MSSV = svn.MSSV where sv.MSSV = ?;",[masv],
    (err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    }) 
};

exports.kiemtradulieusvcn = function(masv,macn,callbackQuery){
    connect();
    connection.query("SELECT * FROM sinhvien_thuoc_nganh where MSSV = ? and MaChuyenNganh = ?",[masv,macn],
    (err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    }) 
};

exports.kiemtradulieubangmang = function(masv,callbackQuery){
    connect();
    connection.query("SELECT * FROM sinhvien_thuoc_nganh where MSSV in (?)",[masv],
    (err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    }) 
};


/*
   Kết thúc xử lý giao diện chia chuyên ngành
*/

/*
    Xử lý giao diện xếp chương trình khung
*/

exports.laymhtheocng = function(macng,callbackQuery){
    connect();
    connection.query("SELECT ctk.MachuyenNganh,ctk.MaMHP,mh.TenMHHP,ctk.HocKy FROM monhocphan mh join chuongtrinhkhung ctk on mh.MaMHP = ctk.MaMHP where ctk.MachuyenNganh = ?",[macng],
    (err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    }) 
};

exports.xoamhkhcn = function(mamh,callbackQuery){
    connect();
    connection.query("DELETE FROM sqlquanlyhocphan.chuongtrinhkhung where  MaMHP = ?",[mamh],
    (err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    }) 
};

exports.themMHCN = function(data,callbackQuery){
    connect();
    connection.query("Insert into chuongtrinhkhung Set ?",[data],
    (err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    }) 
};



/*
   Kết thúc xử lý giao diện xếp chương trình khung
*/