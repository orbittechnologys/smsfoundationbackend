import asyncHandler from "express-async-handler";
import Student from "../schemas/studentSchema.js";
import User from "../schemas/userSchema.js";



export const addStudent = asyncHandler(async (req,res)=> {
    try {
        const {email,firstName,lastName,rollNo,standard,school,password, syllabus,medium} = req.body

        const userDoc = await User.findOne({email});
        if(userDoc){
            console.log("User already exists");
            return res.status(400).json({success:false,msg:"User already exists with the email"})
        }

        const user = await User.create({
            email,
            username:`${firstName} ${lastName}`,
            password,
            role:'STUDENT'
          });

          console.log(user);

        const student = await Student.create({
            email,
            firstName,
            lastName,
            rollNo,
            standard,
            syllabus,
            medium,
            school,
            user:user._id
          });

          return res.status(200).json({success:true,student});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error})
    }
})


export const getStudentByUserId = asyncHandler(async (req,res)=> {
    try {
        const userId = req.params.userId;
        const studentDoc = await Student.find({user: userId});
        return res.status(200).json({success:true,studentDoc});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error})
    }
})
