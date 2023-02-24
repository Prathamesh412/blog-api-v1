const getTokenFromHeader = require("../utils/getTokenFromHeader.utils")
const verifyToken = require("../utils/verifyToken.utils")

const isLogin = (req, res, next) => {
    //get token from header
    const token = getTokenFromHeader(req);

    // verify the token
    const decodedUser = verifyToken(token);

    // save the user into req object
    req.userAuth = decodedUser.id;

    if(!decodedUser){
        return res.json({
            message : "Invalid User or expired token, Login again"
        })
    }else{
        next()
    }
}

module.exports = isLogin;