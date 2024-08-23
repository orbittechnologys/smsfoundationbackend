import asyncHandler from "express-async-handler";
import Instructor from "../schemas/instructorSchema.js";
import User from '../schemas/userSchema.js';
import Student from "../schemas/studentSchema.js";
import { parse } from "json2csv";


export const addInstructor = asyncHandler(async (req,res)=> {
    try {
        const {firstName,middleName, lastName,username,phone,gender,email,qualification, password,school,medium} = req.body;

        const userDoc = await User.findOne({email});
        if(userDoc){
            return res.status(400).json({success:false,msg:"Email already registered"})
        }

        const user = await User.create({
            email,
            username:`${firstName} ${lastName}`,
            phone,
            password,
            loginUser:username,
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
            gender,
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
        // Create a new array that will hold the transformed instructor entries
        let flattenedInstructors = [];
        
        // Iterate through each instructor
        instructors.forEach(instructor => {
            if (instructor.school && instructor.school.length > 0) {
                // If the instructor is associated with schools, create an entry for each school
                instructor.school.forEach(school => {
                    // Clone the instructor data and replace the school array with the single school entry
                    let instructorEntry = {
                        ...instructor._doc, // Accessing the mongoose document data
                        school: school
                    };
                    // Add the new entry to the flattened list
                    flattenedInstructors.push(instructorEntry);
                });
            } else {
                // If no schools are associated, push the instructor as is but with an empty school
                let instructorEntry = {
                    ...instructor._doc,
                    school: null
                };
                flattenedInstructors.push(instructorEntry);
            }
        });

        // Return the transformed list
        return res.status(200).json({ success: true, instructors: flattenedInstructors });

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
        }).populate('school').populate("user").exec();

        // Respond with the list of students found
        return res.status(200).json({ success: true, students });
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})


export const fetchAllInstructorsCSV = asyncHandler(async (req,res) => {
    try {
        
        const instructors = await Instructor.find({}).populate("school").exec();
        // Create a new array that will hold the transformed instructor entries
        let flattenedInstructors = [];
        
        // Iterate through each instructor
        instructors.forEach(instructor => {
            if (instructor.school && instructor.school.length > 0) {
                // If the instructor is associated with schools, create an entry for each school
                instructor.school.forEach(school => {
                    // Clone the instructor data and replace the school array with the single school entry
                    let instructorEntry = {
                        ...instructor._doc, // Accessing the mongoose document data
                        school: school
                    };
                    // Add the new entry to the flattened list
                    flattenedInstructors.push(instructorEntry);
                });
            } else {
                // If no schools are associated, push the instructor as is but with an empty school
                let instructorEntry = {
                    ...instructor._doc,
                    school: null
                };
                flattenedInstructors.push(instructorEntry);
            }
        });

        const csv = parse(flattenedInstructors, { fields: ["firstName", "middleName", "lastName", "email", "phone", "qualification",  "medium", "school.name","school.district","school.state","school.pincode","school.syllabus","school.medium"] });

        res.header('Content-Type', 'text/csv');
        res.attachment('allStudents.csv');
        return res.send(csv);
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})

export const fetchInstructorById = asyncHandler(async (req,res) => {
    try {
        const instructorId = req.params.id;
        const instructor = await Instructor.findById(instructorId).populate("user").populate("school").exec();

        return res.status(200).json({success:true,instructor});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})

export const editInstructor = asyncHandler(async (req,res) => {
    try {
        const  {instructorId, firstName,middleName, lastName,phone,gender,email,qualification,school,medium} = req.body;

        const instructorDoc = await Instructor.findById(instructorId);
        if(!instructorDoc){
            return res.status(400).json({success:false, msg:"No such instructor id found "+instructorId});
        } 

        const userDoc = await User.findById(instructorDoc.user);

        userDoc.email = email;
        userDoc.username = firstName+" "+middleName+" "+lastName;
        userDoc.phone=phone;

        await userDoc.save();

        await Instructor.updateOne({
            _id:instructorId
        },{
            email,
            firstName,
            middleName,
            phone,
            qualification,
            gender,
            lastName,
            school,
            medium,
        })

        return res.status(200).json({success:true,msg:"Edited Instructor successfully"});

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})

export const deleteInstructor = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        const instructorDoc = await Instructor.findById(id);
        if (!instructorDoc ) {
            return res.status(400).json({ success: false, msg: "No instructor found with ID " + id });
        }
        const userId = instructorDoc.user;

        await User.findByIdAndDelete(userId);

        await Instructor.findByIdAndDelete(id);

        return res.status(200).json({ success: true, msg: `Deleted instructor with ID ${id} and user with ID ${userId}` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error", success: false });
    }
});
