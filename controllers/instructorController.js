import asyncHandler from "express-async-handler";
import Instructor from "../schemas/instructorSchema.js";
import User from '../schemas/userSchema.js';


export const addInstructor = asyncHandler(async (req,res)=> {
    try {
        const {firstName,lastName,email, password,school,medium} = req.body;

        const userDoc = await User.findOne({email});
        if(userDoc){
            return res.status(400).json({success:false,msg:"Email already registered"})
        }

        const user = await User.create({
            email,
            username:`${firstName} ${lastName}`,
            password,
            role:'INSTRUCTOR'
          });

          console.log(user);

          const instructor = await Instructor.create({
            email,
            firstName,
            lastName,
            school,
            medium,
            user:user._id
          });

          console.log(instructor);

          return res.status(200).json({success:true,instructor});

    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,error})
    }
})

