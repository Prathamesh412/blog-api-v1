const User = require("../model/User.model")
const Comment = require("../model/Comment.model")
const Category = require("../model/Category.model")
const Post = require("../model/Post.model")
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken.utils");
const getTokenFromHeader = require('../utils/getTokenFromHeader.utils')
const { appErr} = require("../utils/appErr.utils");

// User Reister Controller
const userRegisterCtr = async(req,res,next)=>{
    const { firstname, lastname, email, password } = req.body;
    try{
        const userFound = await User.findOne({ email });
        if (userFound) {
            return next(new AppErr("User Already Exist", 500));
        }
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create USer
        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
        });
        res.json({
            status:"success",
            Message:"user Registered",
            data:user
        })
    }catch(error){
        next(appErr(error.message));
    }
}

// User Login Controller
const userLoginCtr = async(req,res,next)=>{
    const { email, password } = req.body;
    try{
        const userFound = await User.findOne({ email });
        if (!userFound) {
            return res.json({
                msg:"Wrong Email"
            })
        }

        //verify password
        const isPasswordMatched = await bcrypt.compare(
            password,
            userFound.password
        );

        if (!isPasswordMatched) {
            if (!userFound) {         
                return res.json({
                    msg:"Wrong Password"
                })
            }
        }

        res.json({
            status:"success",
            data: {
                firstname: userFound.firstname,
                lastname: userFound.lastname,
                email: userFound.email,
                isAdmin: userFound.isAdmin,
                token: generateToken(userFound._id),
            },
        })
    }catch(error){
        next(appErr(error.message));
    }
}

// Viewed my profile controller
const whoViewedMyProfileCtr =  async(req,res,next)=>{
    try{
        // Find the original user
        const user = await User.findById(req.params.id);

        // FInd the user who viewed the original User
        const ViewedUser = await User.findById(req.userAuth)

        // CHeck the original User and user viewed
        if(user && ViewedUser){
            //check if User who viewed is alredy in the users viewers array
            const isUserAlreadyViewed = user.viewers.find(viewer => viewer.toString()=== ViewedUser._id.toJSON())

            if(isUserAlreadyViewed){
                return next(appErr("You have viewed this profile"))
            }
        else{
            //Push the user who viewed to the user
            user.viewers.push(ViewedUser._id)
            // Save the user
            await user.save()
            res.json({
                status:"success",
                data:"Successfully added users who viewed this profile"
            })
        }
    }   
    }catch(error){
        next(appErr(error.message));
    }
}

// Following controller
const followingCtr = async(req,res,next)=>{

    try{

        const userToFollow = await User.findById(req.params.id)

        // Find the user who is following.
        const userWhoFollow = await User.findById(req.userAuth)

        if(userToFollow && userWhoFollow){
            const isUserAlreadyFollowing = userToFollow.following.find(follower => follower.toString()=== follower._id.toJSON())

            if(isUserAlreadyFollowing){
                return next(appErr("You have followed this profile"))
            }
            else{
                //Push
                userToFollow.followers.push(userWhoFollow._id)
                userWhoFollow.following.push(userToFollow.id)
                
                // Save the user
                await userToFollow.save()
                await userWhoFollow.save()
                res.json({
                    status:"success",
                    data:"Successfully added users who viewed this profile"
                })
            }
        }
    }
    catch(error){
        next(appErr(error.message));
    }
}

//unfollow controller
const unFollowCtrl = async (req, res, next) => {
    try {
      //1. Find the user to unfolloW
    const userToBeUnfollowed = await User.findById(req.params.id);
      //2. Find the user who is unfollowing
    const userWhoUnFollowed = await User.findById(req.userAuth);
      //3. Check if user and userWhoUnFollowed are found
    if (userToBeUnfollowed && userWhoUnFollowed) {
        //4. Check if userWhoUnfollowed is already in the user's followers array
        const isUserAlreadyFollowed = userToBeUnfollowed.followers.find(
        follower => follower.toString() === userWhoUnFollowed._id.toString()
        );
        if (!isUserAlreadyFollowed) {
            return next(appErr("You have not followed this user. Try again next time"));
        } else {
          //5. Remove userWhoUnFollowed from the user's followers array
            userToBeUnfollowed.followers = userToBeUnfollowed.followers.filter(
                follower => follower.toString() !== userWhoUnFollowed._id.toString()
            );
            //save the user
            await userToBeUnfollowed.save();
            //7. Remove userToBeUnfollowed from the userWhoUnfollowed's following array
            userWhoUnFollowed.following = userWhoUnFollowed.following.filter(
                following =>
                following.toString() !== userToBeUnfollowed._id.toString()
            );

            //8. save the user
            await userWhoUnFollowed.save();
            res.json({
                status: "success",
                data: "You have successfully unfollowed this user",
            });
        }
    }
    } catch (error) {
        next(appErr(error.message));
    }
};

// Blocked User Controller
const blockUsersCtrl = async (req, res, next) => {
    try {
        //1. Find the user to be blocked
        const userToBeBlocked = await User.findById(req.params.id);
        //2. Find the user who is blocking
        const userWhoBlocked = await User.findById(req.userAuth);
        //3. Check if userToBeBlocked and userWhoBlocked are found
        if (userWhoBlocked && userToBeBlocked) {
        //4. Check if userWhoUnfollowed is already in the user's blocked array
        const isUserAlreadyBlocked = userWhoBlocked.blocked.find(
            blocked => blocked.toString() === userToBeBlocked._id.toString()
        );
        if (isUserAlreadyBlocked) {
            return next(appErr("You already blocked this user"));
        }
        //7.Push userToBleBlocked to the userWhoBlocked's blocked arr
        userWhoBlocked.blocked.push(userToBeBlocked._id);
        //8. save
        await userWhoBlocked.save();
        res.json({
            status: "success",
            data: "You have successfully blocked this user",
        });
        }
    } catch (error) {
        next(appErr(error.message));
    }
};

//unblock User Controller
const unblockUserCtrl = async (req, res, next) => {
try {
    //1. find the user to be unblocked
    const userToBeUnBlocked = await User.findById(req.params.id);
    //2. find the user who is unblocking
    const userWhoUnBlocked = await User.findById(req.userAuth);
    //3. check if userToBeUnBlocked and userWhoUnblocked are found
    if (userToBeUnBlocked && userWhoUnBlocked) {
    //4. Check if userToBeUnBlocked is already in the arrays's of userWhoUnBlocked
    const isUserAlreadyBlocked = userWhoUnBlocked.blocked.find(
        blocked => blocked.toString() === userToBeUnBlocked._id.toString()
    );
    if (!isUserAlreadyBlocked) {
        return next(appErr("You have not blocked this user"));
    }
    //Remove the userToBeUnblocked from the main user
    userWhoUnBlocked.blocked = userWhoUnBlocked.blocked.filter(
        blocked => blocked.toString() !== userToBeUnBlocked._id.toString()
    );
    //Save
    await userWhoUnBlocked.save();
    res.json({
        status: "success",
        data: "You have successfully unblocked this user",
    });
    }
} catch (error) {
    next(appErr(error.message));
}
};

//admin-block
const adminBlockUserCtrl = async (req, res, next) => {
    try {
        //1. find the user to be blocked
        const userToBeBlocked = await User.findById(req.params.id);
        //2. Check if user found
        if (!userToBeBlocked) {
            return next(appErr("User not Found"));
        }
        //Change the isBlocked to true
        userToBeBlocked.isBlocked = true;
        //4.save
        await userToBeBlocked.save();
            res.json({
            status: "success",
            data: "You have successfully blocked this user",
        });
    } catch (error) {
        next(appErr(error.message));
    }
};

//admin-unblock
const adminUnblockUserCtrl = async (req, res, next) => {
try {
    //1. find the user to be unblocked
    const userToBeunblocked = await User.findById(req.params.id);
    //2. Check if user found
    if (!userToBeunblocked) {
        return next(appErr("User not Found"));
    }
    //Change the isBlocked to false
    userToBeunblocked.isBlocked = false;
    //4.save
    await userToBeunblocked.save();
        res.json({
        status: "success",
        data: "You have successfully unblocked this user",
    });
} catch (error) {
    next(appErr(error.message));
}
};


// Get All User Controller
const userAllCtr =  async (req,res,next)=>{
    try{
        const users = await User.find()
        res.json({
            status:"success",
            data: users
        })
    }catch(error){
        next(appErr(error.message));
    }
}

// Get User Profile Controller
const userProfileCtr =  async(req,res,next)=>{
   // console.log(req.userAuth)
    try{
        const user = await User.findById(req.userAuth); 
        res.json({
            status:"success",
            data:user
        })
    }catch(error){
        next(appErr(error.message));
    }
}

// Update User Controller 
const updateUserCtr =  async(req,res,next)=>{
    const {email, lastname, firstname} = req.body;
    try{
        if(email){
            const emailTaken = await User.findOne({email})

            if(emailTaken){
                return next(appErr('Email is taken', 400))
            }
        }

        // update the user
        const user = await User.findByIdAndUpdate(req.userAuth,{
            lastname,
            firstname,
            email,
        },{
            new: true,
            runValidators: true,
        })

        res.json({
            status:"success",
            data:user
        })
    }catch(error){
        next(appErr(error.message));
    }
}

const updatePasswordCtr =  async(req,res,next)=>{
    const { password } = req.body;
    try {
    //Check if user is updating the password
    if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //update user
        await User.findByIdAndUpdate(
            req.userAuth,
            { password: hashedPassword },
            { new: true, runValidators: true }
            );
        res.json({
            status: "success",
            data: "Password has been changed successfully",
        });
    } else {
        return next(appErr("Please provide password field"));
    }
    } catch (error) {
    next(appErr(error.message));
    }
};

// Delete User Controller
const deleteUserCtr =  async(req,res,next)=>{
    try {
        //1. Find the user to be deleted
        const userTodelete = await User.findById(req.userAuth);
        //2. find all posts to be deleted
        await Post.deleteMany({ user: req.userAuth });
        //3. Delete all comments of the user
        await Comment.deleteMany({ user: req.userAuth });
        //4. Delete all category of the user
        await Category.deleteMany({ user: req.userAuth });
        //5. delete
        await userTodelete.delete();
        //send response
        return res.json({
        status: "success",
        data: "Your account has been deleted successfully",
        });
    } catch (error) {
        next(appErr(error.message));
    }
    };
    

// Photo Upload Controller
const profilePhotoUploadCtr =  async(req,res,next)=>{
    try{

        //1. Find the user to be updated
        const userToUpdate = await User.findById(req.userAuth);

        //2. check if user is found

        if (!userToUpdate) {
        return next(appErr("User not found", 403));
        }

        //3. Check if user is blocked
        if (userToUpdate.isBlocked) {
        return next(appErr("Action not allowed, your account is blocked", 403));
        }

        //4. Check if a user is updating their photo
        if (req.file) {
            
        //5.Update profile photo
        await User.findByIdAndUpdate(
          req.userAuth,
          {
            $set: {
              profilePhoto: req.file.path,
            },
          },
          {
            new: true,
          }
        );
        res.json({
          status: "success",
          data: "You have successfully updated your profile photo",
        });
      }
    } catch (error) {
      next(appErr(error.message, 500));
    }
};

module.exports ={
    userAllCtr,
    userLoginCtr,
    userProfileCtr,
    deleteUserCtr,
    updateUserCtr,
    userRegisterCtr,
    profilePhotoUploadCtr,
    whoViewedMyProfileCtr,
    followingCtr,
    unFollowCtrl,
    blockUsersCtrl,
    unblockUserCtrl,
    adminBlockUserCtrl,
    adminUnblockUserCtrl,
    updatePasswordCtr
}