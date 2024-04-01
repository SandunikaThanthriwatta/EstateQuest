import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';


export const signup=async(req,res)=>{//async is used as await is used below

   const{username,email,password}=req.body;
   const hashedPassword=bcryptjs.hashSync(password,10); //encrypt the password
    const newUser=new User({username,email,password:hashedPassword});//save into the database
    await newUser.save(); //prevent errors and wait until operation finishes
    res.status(201).json("user created successfully");//giving a response

    //disply msgs and error in the client side
    try{
        awaitUser.save(); 
        res.status(201).json('User created successfully!');
    }catch(error){
        res.status(500).json(error.message);
    }

};