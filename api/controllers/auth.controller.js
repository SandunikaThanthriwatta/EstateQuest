import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';


export const signup=async(req,res,next)=>{//async is used as await is used below//next is used to call the middleware

   const{username,email,password}=req.body;
   const hashedPassword=bcryptjs.hashSync(password,10); //encrypt the password
   const newUser=new User({username,email,password:hashedPassword});//save into the database
    
    //disply msgs and error in the client side
    try{
        await newUser.save(); 
        res.status(201).json('User created successfully!');
    }catch(error){
        next(error);
    }

};