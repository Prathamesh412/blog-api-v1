const express = require("express");
const storage = require("../config/cloudinaryconfig");
const { deleteUserCtr, updateUserCtr, userAllCtr,profilePhotoUploadCtr, userProfileCtr, userLoginCtr,unFollowCtrl, userRegisterCtr, whoViewedMyProfileCtr, followingCtr, blockUsersCtrl, unblockUserCtrl, adminBlockUserCtrl, adminUnblockUserCtrl, updatePasswordCtr } = require("../controllers/users.controller");
const isLogin = require("../middlewares/isLogin.middleware")

const multer = require("multer");
const isAdmin = require("../middlewares/isAdmin.middleware");
const userRouter = express.Router();

//Instance of Multer
const upload = multer({storage})

userRouter.post('/register', userRegisterCtr)

userRouter.post('/login', userLoginCtr)

userRouter.get('/profile/',isLogin,userProfileCtr)

userRouter.get('/allusers', userAllCtr)

userRouter.delete('/delete-account',isLogin,deleteUserCtr)

userRouter.put('/',isLogin,updateUserCtr)

userRouter.post("/profile-photo-upload",isLogin, upload.single("profile"), profilePhotoUploadCtr)

userRouter.get("/profile-viewers/:id", isLogin, whoViewedMyProfileCtr)

userRouter.get("/following/:id", isLogin, followingCtr)

userRouter.get("/unfollowing/:id", isLogin, unFollowCtrl)

userRouter.get("/blocked/:id", isLogin, blockUsersCtrl)

userRouter.get("/unblocked/:id", isLogin, unblockUserCtrl)

userRouter.put("/admin-blocked/:id", isAdmin, adminBlockUserCtrl)

userRouter.put("/admin-unblocked/:id", isAdmin, adminUnblockUserCtrl)

userRouter.put("/update-password", isLogin, updatePasswordCtr)


module.exports = userRouter;

