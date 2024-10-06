const checkUser = (req,res,next)=>{
    if(req.cookies.user){
        res.locals.user = req.cookies.user;
    }
    next();
}

export default checkUser;