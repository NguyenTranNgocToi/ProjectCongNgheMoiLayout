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

exports.getAllSV = function(callbackQuery){
    connect();
    connection.query("SELECT * FROM sinhvien", function(err, results,fields){
        if(!err){
            callbackQuery(results);
        }else{
            console.log(err);
           
        }
    })  
    //closeDB();
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
}
/*
    Kết thúc xử lý cho giao diện sinh viên
*/