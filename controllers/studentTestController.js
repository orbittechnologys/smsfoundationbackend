import asyncHandler from "express-async-handler";
import Test from "../schemas/testSchema.js";
import Student from "../schemas/studentSchema.js";
import ChapterTime from "../schemas/chapterTimeSchema.js";
import studentTest from "../schemas/studentTestSchema.js";
import School from '../schemas/schoolSchema.js';
import mongoose from 'mongoose';

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
        return res.status(200).json({success:true,testReport});
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

export const getLearningReportForSchool = asyncHandler(async (req,res) => {
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

        // const testReport = await studentTest.find({}).populate("student").populate("test").exec();
        return res.status(200).json({success:true,testReport});

    } catch (error) {
       console.log(error);
       return res.status(500).json({success:false,error}); 
    }
})