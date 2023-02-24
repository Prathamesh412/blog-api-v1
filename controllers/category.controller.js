const Category = require("../model/Category.model")
const { appErr} = require("../utils/appErr.utils");

const submitCategoryCtr = async(req,res,next)=>{
    const { title } = req.body;
        try {
        const category = await Category.create({ title, user: req.userAuth });
        res.json({
            status: "success",
            data: category,
        });
        } catch (error) {
        return next(appErr(error.message));
    }
}

const getSingleCategoryCtr = async(req,res,next)=>{
    try {
        const category = await Category.findById(req.params.id);
        res.json({
          status: "success",
          data: category,
        });
      } catch (error) {
        res.json(error.message);
    }
}

// All Categories
const getAllCategoryCtr = async(req,res,next)=>{
    try {
        const categories = await Category.find();
        res.json({
          status: "success",
          data: categories,
        });
      } catch (error) {
        res.json(error.message);
    }
}

const deleteCategoryCtr = async(req,res,next)=>{
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({
          status: "success",
          data: "Deleted successfully",
        });
    } catch (error) {
        res.json(error.message);
    }
}

const updateCategoryCtr = async(req,res,next)=>{
    const { title } = req.body;
    try {
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        { title },
        { new: true, runValidators: true }
      );
      res.json({
        status: "success",
        data: category,
      });
    } catch (error) {
      res.json(error.message);
    }
}

module.exports={
    submitCategoryCtr,
    getAllCategoryCtr,
    getSingleCategoryCtr,
    deleteCategoryCtr,
    updateCategoryCtr
}