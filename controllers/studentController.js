import asyncHandler from "express-async-handler";
import Student from "../schemas/studentSchema.js";
import User from "../schemas/userSchema.js";
import { parse } from "json2csv";
import fs from 'fs';
import csv from 'csv-parser'


export const addStudent = asyncHandler(async (req,res)=> {
    try {
        const {email,phone,firstName,middleName, lastName, username, rollNo,standard,gender,school,password, syllabus,medium} = req.body

        const userDoc = await User.findOne({email,username});
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
            loginUser:username,
            phone,
            role:'STUDENT'
          });

          console.log(user);

        const student = await Student.create({
            email,
            firstName,
            lastName,
            middleName,
            rollNo,
            standard,
            syllabus,
            medium,
            school,
            gender,
            user:user._id
          });

          return res.status(200).json({success:true,student});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error})
    }
})


// export const getStudentByUserId = asyncHandler(async (req,res)=> {
//     try {
//         const userId = req.params.userId;
//         const studentDoc = await Student.findOne({user: userId});
//         return res.status(200).json({success:true,studentDoc});
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({success:false,error})
//     }
// })

export const getStudentByUserId = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.userId;

        const studentDoc = await Student.findOne({ user: userId })
            .populate({
                path: 'user',
                select: 'email phone' 
            });

        if (!studentDoc) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        return res.status(200).json({ success: true, studentDoc });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error });
    }
});

export const updateStudent = asyncHandler(async (req,res) => {
    try {

        const {studentId,firstName,lastName,rollNo,standard, email, phone, profilePic } = req.body;
        const studentDoc = await Student.findById(studentId);
        if(!studentDoc){
            console.log("Invalid student id "+studentId);
            return res.status(400).json({success:false,msg:"Invalid student Id"+studentId})
        }
        await Student.updateOne({_id:studentId},{
            firstName,
            lastName,
            rollNo,
            standard,
            profilePic
        })

        await User.updateOne({_id:studentDoc.user},{
            email,
            phone
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
        const students = await Student.find({school:schoolId}).populate("school").populate("user").exec();
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
        const students = await Student.find({}).populate("school").populate("user").exec();
        return res.status(200).json({success:true,students});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})


export const fetchCountGenders = async (req, res) => {
    try {
        const { district } = req.params; // Assuming district is passed in req.params
        console.log('District:', district);
    
        // Aggregate pipeline to group students by gender and district and count them
        const genderCounts = await Student.aggregate([
            {
              $lookup: {
                from: 'schools',
                localField: 'school',
                foreignField: '_id',
                as: 'school'
              }
            },
            { $unwind: '$school' },
            { 
              $match: { 
                'school.district': district 
              } 
            },
            { 
              $group: { 
                _id: '$gender', 
                count: { $sum: 1 } 
              } 
            }
          ]);
        
        console.log('Gender Counts:', genderCounts);
    
        res.status(200).json(genderCounts); // Send response with counts

    } catch (error) {
      console.error('Error fetching gender counts:', error);
      res.status(500).json({ message: 'Internal server error', error });
    }
  };


 export const fetchAllStudentsCSV = async (req,res) => {
    try {
        const students = await Student.find({}).populate("school").exec();
        const csv = parse(students, { fields: [           
            { label: "First Name", value: "firstName" },
            { label: "Middle Name", value: "middleName" },
            { label: "Last Name", value: "lastName" },
            { label: "Roll No", value: "rollNo" },
            { label: "Standard", value: "standard" },
            { label: "Syllabus", value: "syllabus" },
            { label: "Medium", value: "medium" },
            { label: "Gender", value: "gender" },
            { label: "School Name", value: "school.name" },
            { label: "State", value: "school.state" },
            { label: "District", value: "school.district" },
            { label: "Pincode", value: "school.pincode" },
            { label: "Address", value: "school.address" },] });

        res.header('Content-Type', 'text/csv');
        res.attachment('allStudents.csv');
        return res.send(csv);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
 }

 export const uploadStudentsCSV = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded." });
    }

    const results = [];
    const schoolId = req.params.schoolId;
    console.log(schoolId);

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                for (const studentData of results) {
                    const { email, phone, firstName, middleName, lastName, rollNo, standard, gender,  password, syllabus, medium } = studentData;
                    console.log(studentData);
                    const userDoc = await User.findOne({ email });
                    if (!userDoc) {
                        const user = await User.create({
                            email,
                            username: `${firstName} ${lastName}`,
                            password,
                            phone,
                            role: 'STUDENT'
                        });

                        await Student.create({
                            email,
                            firstName,
                            lastName,
                            middleName,
                            rollNo,
                            standard,
                            syllabus,
                            medium,
                            school: schoolId,
                            gender,
                            user: user._id
                        });
                    }
                }
                fs.unlinkSync(req.file.path); // Remove the file after processing
                res.status(200).json({ success: true, message: "Students added successfully." });
            } catch (error) {
                console.error(error);
                fs.unlinkSync(req.file.path); // Remove the file after processing
                res.status(500).json({ success: false, error });
            }
        });
});

export const deleteStudent = asyncHandler(async(req,res)=>{
    try {
        const id = req.params.id;
        const studentDoc = await Student.findById(id);
        if(!studentDoc){
            return res.status(400).json({success:false, msg:`Student not found with id ${id}` });
        }   
        const userId = studentDoc.user;
        console.log(userId,"to be deleted");
        await User.findByIdAndDelete(userId);
        console.log("Successfully deleted user "+userId);
        await Student.findByIdAndDelete(id);
        console.log("Successfully Deleted Student:"+id);
        return res.status(200).json({success:true, msg:`Student with id ${id} deleted successfully` });     
    } catch (error) {
        console.error(error);
        res.status(500).json({msg: "Internal server error", success: false });
    }
})
