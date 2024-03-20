import asyncHandler from "express-async-handler";
import SubjectTime from "../schemas/subjectTimeSchema.js";

export const getOverallSubjectReport = asyncHandler(async(req,res)=> {
    try {
        const subjectReport = await SubjectTime.find({}).populate("subject").populate("student");
        return res.status(200).json({success:true,subjectReport});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error})
    }
})