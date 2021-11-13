//NTNT ket noi my sql
var mysql = require('mysql');
var connection = mysql.createConnection({
    //local

    host:'localhost',
    user:'root',
    password:'sapassword',
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

// Lấy dữ liệu từ bảng sinh viên
exports.getAllSV = function(callbackQuery){
    connect();// order by MSSV DESC limit 5
    connection.query("SELECT * FROM sinhvien order by MSSV DESC limit 5", function(err, results,fields){
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

exports.updateSV = function(masv,hoten,gioitinh,ns,diachi,dienthoai,callbackQuery){
    connect();
    connection.query("update sinhvien set DiaChi = ?, GioiTinh = ?, HoTen = ?, NgaySinh = ?, SoDT = ? where MSSV = ?",
    [diachi,gioitinh,hoten,ns,dienthoai,masv],(err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    }) 
};


exports.timkiemsv = function(tukhoa,callbackQuery){
    connect();
    connection.query("Select * from sinhvien where Hoten like N'%"+tukhoa+"%' or DiaChi like N'%"+tukhoa+"%' or MSSV like N'%"+tukhoa+"%' limit 10",
    (err,results)=>{
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
            results = null;
        }
    }) 
}

//update pass tk sinh viên
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
}
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