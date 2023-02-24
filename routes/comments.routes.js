const express = require("express");
const { submitComments, getSingleComments, getAllComments, deleteComments, updateComments } = require("../controllers/comments.controller");
const isLogin = require("../middlewares/isLogin.middleware")

const commentsRouter = express.Router();

commentsRouter.post('/:id',isLogin, submitComments)

// commentsRouter.get('/:id', getSingleComments)

// commentsRouter.get('/', getAllComments)

commentsRouter.delete('/:id', isLogin, deleteComments )

commentsRouter.put('/:id', isLogin, updateComments)

module.exports = commentsRouter;