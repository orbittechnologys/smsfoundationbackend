import asyncHandler from "express-async-handler";
import User from "../schemas/userSchema.js";
import { generateOtp, sendEmail } from "../helpers/utils.js";

export const register = asyncHandler(async (req, res) => {
  try {
    const { email, username, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json("User already exists!");
    }

    const user = await User.create({
      email,
      username,
      password,
      role,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
});


export const login = asyncHandler(async (req,res) => {
  try {
    const { email, password } = req.body;
  
    // checks for email
    const user = await User.findOne({ 
      $or: [ 
        { email: email }, 
        { loginUser: email } 
      ] 
    });
    if(!user){
      res.status(400).json({ message: 'Email or Username not registered' });
    }
    //checks for password
    if (user && (await user.matchPassword(password))) {
      // const token = generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.username,
        email: user.email,
        role: user.role,
      });
      // console.log(req.cookies);
    } else {
      res.status(400).json({ message: 'Incorrect Password.' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
})

export const getUser = asyncHandler(async (req,res)=> {
  try {
    const userId = req.params.userId;
    
    const userDoc = await User.findById(userId);

    if(!userDoc){
      return res.status(400).json({success:true,msg:"No user with id"+userId});
    }

    return res.status(200).json({success:true,userDoc});
  } catch (error) {
    console.log(error);
    return res.status(500).json({success:false,error})
  }
})

export const resetPassword = asyncHandler(async (req,res) => {
  try {
    const {userId,newPassword} = req.body;

    let userDoc = await User.findById(userId);

    if(!userDoc){
      return res.status(400).json({success:false,msg:"No user with id:"+userId});
    }

    userDoc.password = newPassword;
    await userDoc.save();

    return res.status(200).json({
      success:true,
      userDoc
    })


  } catch (error) {
    console.log(error);
    return res.status(500).json({success:false,error});
  }
})

export const createLocalAdmin = asyncHandler(async (req,res) => {
  try {
    const userDoc = await User.create({
      email:"admin@smsfoundation.com",
      username:"Local Admin",
      phone:"8904489085",
      password:"abc1234",
      role:"ADMIN"
    })

    return res.status(200).json({
      success:true,
      userDoc
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      error
    })
  }
})

export const checkUsernamePresent = asyncHandler(async (req,res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({loginUser:username});
    if(user){
      console.log('Username already taken',username);
      return res.status(400).json({success:false,msg:"Username already taken "+username});
    }else{
      console.log('username available');
      return res.status(200).json({success:true,msg:"Username available"+username})
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      error
    })
  }
})

export const triggerOtp = asyncHandler(async (req,res) => {
  try {
    const {email} = req.body;
    const userDoc = await User.findOne({email});
    if(!userDoc){
      console.log("Could not find user with email:"+email);
      return res.status(400).json({
        email,
        msg:"Could not find user with email:"+email,
        success:false
      })
    }

    const otp = generateOtp();
    await sendEmail(email,"OTP to Reset Password", `
      \n Hello ${userDoc?.username}, Your OTP to reset Password is ${otp}.
      \n Regards SMSF Foundation
    `)

    return res.status(200).json({
      userDoc,
      otp,
      success:false
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({success:false,error})
  }
})

export const deleteUser = asyncHandler(async(req,res)=>{
  try {
    const id = req.params.id;
    const userDoc = await User.findByIdAndDelete(id);
    if(!userDoc || userDoc.length === 0){
      return res.status(400).json({msg:`User could not delete or find with id ${id}`,success:false});
    }

    return res.status(200).json({msg:`Successfully deleted user with id ${id}`,success:true});
  } catch (error) {
    console.error(error);
    return res.status(500).json({msg:"Internal server error", success:false});
  }
});



