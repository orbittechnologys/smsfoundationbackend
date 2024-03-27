import asyncHandler from "express-async-handler";
import School from '../schemas/schoolSchema.js'

export const addSchool = asyncHandler(async (req,res)=> {
    try {
        const {name,principalName,address,district,pincode,internet, syllabus,medium} = req.body;

        const school = await School.create({
            name,principalName,address,district,pincode,internet, syllabus,medium
          });
        
        console.log(school);

        return res.status(200).json({success:true,school});

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})

export const getAllSchool = asyncHandler(async (req,res)=> {
    try {
        const schools = await School.find({});
        return res.status(200).json({success:true,schools});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error})
    }
})