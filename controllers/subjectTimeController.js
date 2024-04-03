import asyncHandler from "express-async-handler";
import SubjectTime from "../schemas/subjectTimeSchema.js";
import School from '../schemas/schoolSchema.js';
import Student from '../schemas/studentSchema.js';
import mongoose from 'mongoose';
import { parse } from "json2csv";

export const getOverallSubjectReport = asyncHandler(async(req,res)=> {
    try {
        const subjectReport = await SubjectTime.find({})
        .populate("subject")
        .populate({
            path:'student',
            populate:{path:'school'} 
        }).exec();
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
                    from:"schools",
                    localField:"student.school",
                    foreignField:"_id",
                    as:"school"
                }
            },
            {
                $unwind:"$school"
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

export const getSubjectReportCSV = asyncHandler(async(req,res)=> {
    try {
        const subjectReport = await SubjectTime.find({})
        .populate("subject")
        .populate({
            path:'student',
            populate:{path:'school'} 
        }).exec();

        const csvData = subjectReport.map(item => ({
            studentId: item.student._id,
            studentFirstName: item.student.firstName,
            studentLastName: item.student.lastName,
            rollNo: item.student.rollNo,
            standard: item.student.standard,
            studentSyllabus: item.student.syllabus,
            studentMedium: item.student.medium,
            schoolName: item.student.school?.name,
            schoolDistrict: item.student.school?.district,
            pincode:item.student.school?.pincode,
            subjectName: item.subject.name,
            subjectStandard: item.subject.standard,
            subjectSyllabus: item.subject.syllabus,
            subjectMedium: item.subject.medium,
            timeSpent: item.time
        }));

        const csv = parse(csvData, { fields: ["studentId", "studentFirstName", "studentLastName", "rollNo", "standard", "studentSyllabus", "studentMedium", "schoolName", "schoolDistrict", "pincode", "subjectName", "subjectStandard", "subjectSyllabus", "subjectMedium", "timeSpent"] });

        res.header('Content-Type', 'text/csv');
        res.attachment('subjectReport.csv');
        return res.send(csv);
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error})
    }
})

export const getSubjectReportSchoolCSV = asyncHandler(async (req,res) => {
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
                    from:"schools",
                    localField:"student.school",
                    foreignField:"_id",
                    as:"school"
                }
            },
            {
                $unwind:"$school"
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

        const csvData = subjectReport.map(item => ({
            studentId: item.student._id,
            studentFirstName: item.student.firstName,
            studentLastName: item.student.lastName,
            rollNo: item.student.rollNo,
            standard: item.student.standard,
            studentSyllabus: item.student.syllabus,
            studentMedium: item.student.medium,
            schoolName: item.school?.name,
            schoolDistrict: item.school?.district,
            pincode:item.school?.pincode,
            subjectName: item.subject.name,
            subjectStandard: item.subject.standard,
            subjectSyllabus: item.subject.syllabus,
            subjectMedium: item.subject.medium,
            timeSpent: item.time
        }));

        const csv = parse(csvData, { fields: ["studentId", "studentFirstName", "studentLastName", "rollNo", "standard", "studentSyllabus", "studentMedium", "schoolName", "schoolDistrict", "pincode", "subjectName", "subjectStandard", "subjectSyllabus", "subjectMedium", "timeSpent"] });

        res.header('Content-Type', 'text/csv');
        res.attachment('testReportSchool.csv');
        return res.send(csv);

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})