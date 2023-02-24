const User = require("../model/User.model");
const { appErr } = require("../utils/appErr.utils");
const getTokenFromHeader = require("../utils/getTokenFromHeader.utils");
const verifyToken = require("../utils/verifyToken.utils");

const isAdmin = async (req, res, next) => {
  //get token from header
    const token = getTokenFromHeader(req);
    //verify the token
    const decodedUser = verifyToken(token);
    //save the user into req obj
    req.userAuth = decodedUser.id;
    //Find the user in DB
    const user = await User.findById(decodedUser.id);
    //Check if admin
    if (user.isAdmin) {
        return next();
        } else {
        return next(appErr("Access Denied, Admin Only", 403));
    }
};

module.exports = isAdmin;