const User = require("../model/User.model")
const Comment = require("../model/Comment.model")
const Post = require("../model/Post.model")
const {appErr}= require("../utils/appErr.utils")

const submitComments = async(req,res,next)=>{
    const { description } = req.body;
    try {
      //Find the post
      const post = await Post.findById(req.params.id);
      //create comment
      const comment = await Comment.create({
        post: post._id,
        description,
        user: req.userAuth,
      });
      //push the comment to post
      post.comments.push(comment._id);
      //Find the user
      const user = await User.findById(req.userAuth);
      //Push to user
      user.comments.push(comment._id);
      //save
      //Disable validation
      await post.save({ validateBeforeSave: false });
      await user.save({ validateBeforeSave: false });
  
      res.json({
        status: "success",
        data: comment,
      });
    } catch (error) {
      next(appErr(error.message));
    }
  };
  

const getSingleComments = async(req,res,next)=>{
    try{
        res.json({
            status:"success",
            data:"Get single comments route"
        })
    }catch(error){
        res.json(error.message)
    }
}

const getAllComments = async(req,res,next)=>{
    try{
        res.json({
            status:"success",
            data:"Get all comments Route"
        })
    }catch(error){
        res.json(error.message)
    }
}

const deleteComments = async(req,res,next)=>{
    try {
        //find the Comment
        const comment = await Comment.findById(req.params.id);
        if (comment.user.toString() !== req.userAuth.toString()) {
          return next(appErr("You are not allowed to update this comment", 403));
        }
        await Comment.findByIdAndDelete(req.params.id);
        res.json({
          status: "success",
          data: "Comment has been deleted successfully",
        });
      } catch (error) {
        next(appErr(error.message));
      }
    };

const updateComments = async(req,res,next)=>{
    const { description } = req.body;
    try {
      //find the Comment
      const comment = await Comment.findById(req.params.id);
      if (comment.user.toString() !== req.userAuth.toString()) {
        return next(appErr("You are not allowed to update this comment", 403));
      }
  
      const category = await Comment.findByIdAndUpdate(
        req.params.id,
        { description },
        { new: true, runValidators: true }
      );
      res.json({
        status: "success",
        data: category,
      });
    } catch (error) {
      next(appErr(error.message));
    }
  };
  
module.exports = {
    submitComments,
    getAllComments,
    getSingleComments,
    deleteComments,
    updateComments
}