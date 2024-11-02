const jwt = require('jsonwebtoken');
function verifyToken(req,res,next){
    // const token = req.header('Authorization');
    const token = req.cookies.token;
    res.locals.isAuthenticated = false;
    if(!token) 
        // return res.status(401).json({error:'Access denied'});
        return next();
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.userId = decoded.userId;
        res.locals.isAuthenticated = true;
        res.locals.userId = decoded.userId; //to access in templates
        console.log('User authenticated:', res.locals.isAuthenticated);
    }catch(error){
        console.log('Token verification error:', error);
        // res.status(401).json({error:'Invalid token'});
    }
    next();
};

module.exports = verifyToken;