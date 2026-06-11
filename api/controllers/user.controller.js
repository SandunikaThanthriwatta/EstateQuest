import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import Listing from "../models/listing.model.js";

export const test=(req,res)=>{
    res.json({
        message:'API route is working!',
    });

};

export const updateUser=async (req,res,next)=>{
    if(req.user.id!==req.params.id) return next(errorHandler(401, "You can only update your own account!"))
    try {
        if(req.body.password){
            req.body.password =bcryptjs.hashSync(req.body.password,10)
        }

        const fields = {};
        if (req.body.username !== undefined) fields.username = req.body.username;
        if (req.body.email    !== undefined) fields.email    = req.body.email;
        if (req.body.password !== undefined) fields.password = req.body.password;
        if (req.body.avatar   !== undefined) fields.avatar   = req.body.avatar;

        const updateUser=await User.findByIdAndUpdate(req.params.id,{$set:fields},{new:true})

        const {password,...rest}=updateUser._doc
        res.status(200).json(rest);

    } catch (error) {
        next(error)
    }
};

export const deleteUser=async(req,res,next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler(401,'You can only delete your own account'))
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token')
        res.status(200).json('User has been deleted!');
    } catch (error) {
        next(error);
    }
}

export const getUserListings = async (req, res, next) => {
    if (req.user.id === req.params.id) {
      try {
        const listings = await Listing.find({ userRef: req.params.id });
        res.status(200).json(listings);
      } catch (error) {
        next(error);
      }
    } else {
      return next(errorHandler(401, 'You can only view your own listings!'));
    }
  };