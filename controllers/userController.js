import asyncHandler from "express-async-handler";
import User from "../schemas/userSchema.js";

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