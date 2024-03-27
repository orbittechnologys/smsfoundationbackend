import asyncHandler from "express-async-handler";
import SubjectTime from "../schemas/subjectTimeSchema.js";
import School from '../schemas/schoolSchema.js';
import Student from '../schemas/studentSchema.js';
import mongoose from 'mongoose';

export const getOverallSubjectReport = asyncHandler(async(req,res)=> {
    try {
        const subjectReport = await SubjectTime.find({}).populate("subject").populate("student");
        return res.status(200).json({success:true,subjectReport});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error})
    }
})

export const getSubjectReportOfSchool = asyncHandler(async(req,res)=> {
    try {
        const schoolId = req.params.schoolId;
        const schoolDoc = await School.findById(schoolId);
        if(!schoolDoc){
            console.log("Invalid school id "+schoolId);
            return res.status(400).json({success:false,msg:"Invalid school id "+schoolId});
        }
        console.log('Fetching learning report for school',schoolDoc.name);

        const students = await Student.find({ school: schoolId });
        console.log("Students:", students);

        // Extract student IDs from the students found
        const studentIds = students.map(student => student._id);

        const objectIdSchoolId = new mongoose.Types.ObjectId(schoolId);

        const subjectReport = await SubjectTime.aggregate([
            {
                $lookup: {
                    from: "students", // Name of the students collection
                    localField: "student",
                    foreignField: "_id",
                    as: "student"
                }
            },
            {
                $match: {
                    "student.school": objectIdSchoolId
                }
            },
            {
                $unwind: "$student"
            },
            {
                $lookup: {
                    from: "subjects", // Name of the subjects collection
                    localField: "subject",
                    foreignField: "_id",
                    as: "subject"
                }
            },
            {
                $unwind: "$subject"
            }
        ]);

        return res.status(200).json({success:true,subjectReport});

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})