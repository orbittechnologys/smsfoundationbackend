import asyncHandler from "express-async-handler";
import Test from "../schemas/testSchema.js";
import Student from "../schemas/studentSchema.js";
import ChapterTime from "../schemas/chapterTimeSchema.js";
import studentTest from "../schemas/studentTestSchema.js";
import School from '../schemas/schoolSchema.js';
import mongoose from 'mongoose';
import { parse } from "json2csv";
import { getPercentage } from "../helpers/utils.js";

export const submitTest = asyncHandler(async (req,res)=> {
    try {
        const {
            testId,
            studentId,
            marks
        } = req.body;

        const test = await Test.findById(testId);
        if(!test){
            return res.status(400).json({success:false,msg:"No such test "+testId})
        }

        const student = await Student.findById(studentId);
        if(!student){
            return res.status(400).json({success:false,msg:"No such student "+studentId})
        }

        const chapterTime = await ChapterTime.findOne({student:studentId, chapter:test.chapter});
        console.log(chapterTime);

        if(chapterTime){
            await ChapterTime.updateOne({_id:chapterTime._id},{
                status:"COMPLETED"
            })
        }

        const studentTestDoc = await studentTest.findOne({
            "student":studentId,
            "test":testId
        })

        if(studentTestDoc){
            await studentTest.updateOne({_id:studentTestDoc._id},{
                marks:marks
            })
            return res.status(200).json({success:true,"msg":"Updated student test"});
        }else{
            const studentTestEntry = await studentTest.create({
                student:studentId,
                test:testId,
                marks,
              });
              return res.status(200).json({success:true,studentTestEntry})
        }
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})

export const getTestsForStudent = asyncHandler(async (req,res)=> {
    try {
        const studentId = req.params.studentId;
        const student = await Student.findById(studentId);
        if(!student){
            return res.status(400).json({success:false,msg:"No such student found "+studentId})
        }

        const studentTests = await studentTest.find({ student: studentId })
        .populate({
            path: 'test',
            populate: { path: 'chapter' }
        })
        .exec();

        return res.status(200).json({success:true,studentTests})

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})

export const getTestReport = asyncHandler(async (req,res)=> {
    try {
        const testReport = await studentTest.find({})
        .populate({
            path:'student',
            populate:{path:'school'} 
        })
        .populate("test").exec();

        const modifiedTestReport = testReport.map((report) => ({
            _id: report._id,
            student: {
              ...report.student.toObject(),
              school: report.student.school._id, // Extract only school ID
            },
            test: report.test,
            marks: report.marks,
            __v: report.__v,
            school: report.student.school, // Add school details outside of student
            percentage: getPercentage(report.marks,report.test.totalMarks)
          }));



        return res.status(200).json({success:true,testReport : modifiedTestReport});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error})
    }
})

export const getTestResults = asyncHandler(async (req,res)=>{
    try {
        const {
            studentId,
            testId
        } = req.body;
        const testResults = await studentTest.findOne({student:studentId,test:testId}).populate("student").populate("test").exec();

        return res.status(200).json({success:true,testResults})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error})
    }
})

export const getTestReportForSchool = asyncHandler(async (req,res) => {
    try {
        const schoolId = req.params.schoolId;
        const schoolDoc = await School.findById(schoolId);
        if(!schoolDoc){
            console.log("Invalid school id "+schoolId);
            return res.status(400).json({success:false,msg:"Invalid school id "+schoolId});
        }

        const objectIdSchoolId = new mongoose.Types.ObjectId(schoolId);

        const testReport = await studentTest.aggregate([
            {
                $lookup:{
                    from:"students", // name of the collection in mongo db
                    localField:"student",
                    foreignField:"_id",
                    as:"student"
                }
            },// performs left outer join on students
            {
                $match:{
                    "student.school":objectIdSchoolId
                }
            }, //Performs matching i,e. matches student document's school with schoolId
            {
                $unwind:"$student" // Performs same as populate()
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
                $lookup:{
                    from:"tests", //name of collection in mongo db
                    localField:"test",
                    foreignField:"_id",
                    as:"test"
                }
            },
            {
                $unwind:"$test"
            },
            {
                $addFields: {
                    "percentage": {
                        $round: [{ // Round the result of the following operation
                            $cond: {
                                if: { $eq: ["$test.totalMarks", 0] }, // Check if totalMarks is 0
                                then: 0, // If true (i.e., totalMarks is 0), set percentage to 0
                                else: {
                                    $multiply: [
                                        { $divide: ["$marks", "$test.totalMarks"] }, 100
                                    ]
                                }
                            }
                        }, 2] // Specify rounding to 2 decimal places
                    }
                }
            }
        ])

        // const testReport = await studentTest.find({}).populate("student").populate("test").exec();
        return res.status(200).json({success:true,testReport});

    } catch (error) {
       console.log(error);
       return res.status(500).json({success:false,error}); 
    }
})

export const getTestReportCSV = asyncHandler(async (req,res) => {
    try {
        const testReport = await studentTest.find({})
        .populate({
            path:'student',
            populate:{path:'school'} 
        })
        .populate("test").exec();

        const csvData = testReport.map(item => ({
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
            testName: item.test.name,
            questions:item.test.noOfQuestions,
            totalMarks:item.test.totalMarks,
            marksScored: item.marks,
        }));

        const csv = parse(csvData,
             { fields: ["studentId", "studentFirstName", "studentLastName", "rollNo", "standard", "studentSyllabus", "studentMedium", "schoolName", "schoolDistrict", "pincode", "testName", "questions", "totalMarks", "marksScored"] });

        res.header('Content-Type', 'text/csv');
        res.attachment('testReport.csv');
        return res.send(csv);

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error})
    }
})

export const getTestReportSchoolCSV = asyncHandler(async (req,res) => {
    try {
        const schoolId = req.params.schoolId;
        const schoolDoc = await School.findById(schoolId);
        if(!schoolDoc){
            console.log("Invalid school id "+schoolId);
            return res.status(400).json({success:false,msg:"Invalid school id "+schoolId});
        }

        const objectIdSchoolId = new mongoose.Types.ObjectId(schoolId);

        const testReport = await studentTest.aggregate([
            {
                $lookup:{
                    from:"students", // name of the collection in mongo db
                    localField:"student",
                    foreignField:"_id",
                    as:"student"
                }
            },// performs left outer join on students
            {
                $match:{
                    "student.school":objectIdSchoolId
                }
            }, //Performs matching i,e. matches student document's school with schoolId
            {
                $unwind:"$student" // Performs same as populate()
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
                $lookup:{
                    from:"tests", //name of collection in mongo db
                    localField:"test",
                    foreignField:"_id",
                    as:"test"
                }
            },
            {
                $unwind:"$test"
            }
        ])

        const csvData = testReport.map(item => ({
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
            testName: item.test.name,
            questions:item.test.noOfQuestions,
            totalMarks:item.test.totalMarks,
            marksScored: item.marks,
        }));

        const csv = parse(csvData,
             { fields: ["studentId", "studentFirstName", "studentLastName", "rollNo", "standard", "studentSyllabus", "studentMedium", "schoolName", "schoolDistrict", "pincode", "testName", "questions", "totalMarks", "marksScored"] });

        res.header('Content-Type', 'text/csv');
        res.attachment('testReportSchool.csv');
        return res.send(csv);

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})

export const fetchLatestStudentTests = async (req, res) => {
    try {
      const { studentId } = req.params; // Assuming studentId is passed in req.params
  
      const latestTests = await studentTest.find({ student: studentId })
        .sort({ updatedAt: -1 }) // Sort by updatedAt in descending order
        .limit(5); // Limit to 5 documents
  
      res.status(200).json(latestTests);
    } catch (error) {
      console.error('Error fetching latest student tests:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };