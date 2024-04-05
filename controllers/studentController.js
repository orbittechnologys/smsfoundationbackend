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

        const studentDoc = await Student.findOne({rollNo,school});
        if(studentDoc){
            console.log("User already exists");
            return res.status(400).json({success:false,msg:"User already exists with the rollNo and school"})
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
        const studentDoc = await Student.findOne({user: userId});
        return res.status(200).json({success:true,studentDoc});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error})
    }
})

export const updateStudent = asyncHandler(async (req,res) => {
    try {

        const {studentId,firstName,lastName,rollNo,standard, email } = req.body;
        const studentDoc = await Student.findById(studentId);
        if(!studentDoc){
            console.log("Invalid student id "+studentId);
            return res.status(400).json({success:false,msg:"Invalid student Id"+studentId})
        }
        await Student.updateOne({_id:studentId},{
            firstName,
            lastName,
            rollNo,
            standard
        })

        await User.updateOne({_id:studentDoc.user},{
            email,
        })

        console.log("Updated student Doc");
        return res.status(200).json({success:true,msg:"Updated Student Successfully"})

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error})
    }
})


export const getStudent = asyncHandler(async (req,res) => {
    try {
        const studentId = req.params.studentId;
        const studentDoc = await Student.findById(studentId);

        if(!studentDoc){
            console.log("No student found with id "+studentId);
            return res.status(400).json({success:false,msg:"No student found with id "+studentId})
        }

        return res.status(200).json({success:true,studentDoc});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error})
    }
})

export const getStudentsBySchool = asyncHandler(async (req,res) => {
    try {
        const schoolId = req.params.schoolId;
        const students = await Student.find({school:schoolId});
        return res.status(200).json({success:true,students});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})

export const getStudentsQuery = asyncHandler(async (req,res) => {
    try {
        const query = req.params.query;
        const regexPattern = new RegExp(query, "i");
        
        const students = await Student.find({
            firstName:{$regex :regexPattern}
          });
          return res.status(200).json({success:true,students});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})

export const getStudentsQueryViaSchool = asyncHandler (async (req,res)=> {
    try {
        const query = req.headers.query;
        const schoolId = req.headers.school;

        console.log(query,schoolId,"Search in progress")

        const regexPattern = new RegExp(query, "i");
        const students = await Student.find({
            firstName:{$regex :regexPattern},
            school:schoolId
          });
          return res.status(200).json({success:true,students});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})

export const resetPassword = asyncHandler(async (req,res) => {
    try {
        const {studentId, newPassword} = req.body;

        const studentDoc = await Student.findById(studentId);
        if(!studentDoc){
            console.log("Student id not valid "+studentId);
            return res.status(400).json({success:false,msg:"Student id not valid "+studentId})
        }

        const userDoc = await User.findById(studentDoc.user);

        userDoc.password = newPassword;

        await userDoc.save();

        return res.status(200).json({success:true,msg:"Password updated successfully"})

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})

export const getAllStudents = asyncHandler(async (req,res) => {
    try {
        const students = await Student.find({}).populate("school").exec();
        return res.status(200).json({success:true,students});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})