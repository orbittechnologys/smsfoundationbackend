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

    // if (user) {
    //   generateToken(res, user._id)
    //   res.status(200).json({
    //     _id: user._id,
    //     username: user.username,
    //     email: user.email,
    //     password: user.password,
    //   })
    // } else {
    //   res.status(400).json("Invalid user data");
    // }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
});


export const login = asyncHandler(async (req,res) => {
  try {
    const { email, password } = req.body;
  
    // checks for email
    const user = await User.findOne({ email });
    if(!user){
      res.status(400).json({ message: 'Email not registered' });
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