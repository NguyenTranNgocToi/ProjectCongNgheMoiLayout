
module.exports.requireAuth = function(req, res, next){
    
    const{cookies} =req;
    console.log(cookies.ms);
    var ms = cookies.ms;
    if(!cookies.ms){
        //return res.render('./bodyChung/TrangChu',{layout: './layouts/layoutChung' , title: 'Trang Chủ'}, mess='');
        return res.redirect('/');
    }
    next();
};