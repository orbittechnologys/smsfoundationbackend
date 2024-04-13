import asyncHandler from "express-async-handler";
import Instructor from "../schemas/instructorSchema.js";
import User from '../schemas/userSchema.js';
import Student from "../schemas/studentSchema.js";


export const addInstructor = asyncHandler(async (req,res)=> {
    try {
        const {firstName,middleName, lastName,phone,gender,email,qualification, password,school,medium} = req.body;

        const userDoc = await User.findOne({email});
        if(userDoc){
            return res.status(400).json({success:false,msg:"Email already registered"})
        }

        const user = await User.create({
            email,
            username:`${firstName} ${lastName}`,
            phone,
            password,
            role:'INSTRUCTOR'
          });

          console.log(user);

          const instructor = await Instructor.create({
            email,
            firstName,
            middleName,
            phone,
            qualification,
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


export const getInstructorByUserId = asyncHandler(async (req,res)=> {
    try {
        const userId = req.params.userId;
        const instructorDoc = await Instructor.findOne({user: userId}).populate("school").exec();
        return res.status(200).json({success:true,instructorDoc});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})

export const getAllInstructor = asyncHandler ( async (req,res) => {
    try {
        const instructors = await Instructor.find({}).populate("school").exec();
        return res.status(200).json({success:true,instructors});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})


export const resetPassword = asyncHandler(async (req,res) => {
    try {
        const {instructorId, newPassword} = req.body;

        const instructorDoc = await Instructor.findById(instructorId);
        if(!instructorDoc){
            console.log("Student id not valid "+instructorId);
            return res.status(400).json({success:false,msg:"Student id not valid "+instructorId})
        }

        const userDoc = await User.findById(instructorDoc.user);

        userDoc.password = newPassword;

        await userDoc.save();

        return res.status(200).json({success:true,msg:"Password updated successfully"})

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})

export const fetchStudentsByInstructorId = asyncHandler(async (req,res) => {
    try {
        const instructorId = req.params.instructorId;
        const instructor = await Instructor.findById(instructorId).select('school').exec();
        console.log(instructor);

        if (!instructor) {
            return res.status(404).json({ success: false, message: 'Instructor not found' });
        }

        // Step 2: Use the array of school IDs to find all students who are in those schools
        const students = await Student.find({ 
            school: { $in: instructor.school } 
        }).exec();

        // Respond with the list of students found
        return res.status(200).json({ success: true, students });
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})