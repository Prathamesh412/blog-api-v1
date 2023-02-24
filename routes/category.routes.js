const express = require("express");
const { submitCategoryCtr, getSingleCategoryCtr, getAllCategoryCtr, deleteCategoryCtr, updateCategoryCtr } = require("../controllers/category.controller");
const isLogin = require("../middlewares/isLogin.middleware")

const categoryRouter = express.Router();

// ROutes
categoryRouter.post('/', isLogin, submitCategoryCtr)

categoryRouter.get('/:id', getSingleCategoryCtr)

categoryRouter.get('/',getAllCategoryCtr)

categoryRouter.delete('/:id', isLogin,deleteCategoryCtr)

categoryRouter.put('/:id', isLogin,updateCategoryCtr)


module.exports = categoryRouter;