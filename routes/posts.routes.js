const express = require("express");
const { postDeleteCtr, postUpdateCtr, allPostsCtr, singlePostCtr, postSubmitCtr, toggleLikesPostCtrl, toggleDisLikesPostCtrl } = require("../controllers/posts.controller");
const storage = require("../config/cloudinaryconfig")
const isLogin = require("../middlewares/isLogin.middleware")
const postRouter = express.Router();
const multer = require('multer');

//File Upload Middleware
const upload = multer({
    storage
})

// Controllers
postRouter.post('/',isLogin, upload.single('image'),postSubmitCtr)

postRouter.get('/:id',isLogin,singlePostCtr)

postRouter.get('/',isLogin, allPostsCtr)

postRouter.delete('/:id',isLogin, postDeleteCtr)

postRouter.put('/:id',isLogin, postUpdateCtr)

postRouter.get('/dislikes/:id',isLogin, toggleDisLikesPostCtrl)

postRouter.get('/likes/:id',isLogin, toggleLikesPostCtrl)

module.exports = postRouter;
