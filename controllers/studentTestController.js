import asyncHandler from "express-async-handler";
import Test from "../schemas/testSchema.js";
import Student from "../schemas/studentSchema.js";
import ChapterTime from "../schemas/chapterTimeSchema.js";
import studentTest from "../schemas/studentTestSchema.js";

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
        const testReport = await studentTest.find({}).populate("student").populate("test").exec();
        return res.status(200).json({success:true,testReport});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error})
    }
})