import asyncHandler from "express-async-handler";
import School from '../schemas/schoolSchema.js';
import Student from '../schemas/studentSchema.js';
import Instructor from '../schemas/instructorSchema.js';
import { parse } from "json2csv";

export const addSchool = asyncHandler(async (req,res)=> {
    try {
        const {name,principalName,principalContact,address,district,state,pincode,internet, syllabus,medium, projectName,partnerName} = req.body;

        const school = await School.create({
            name,principalName,principalContact,address,district,state,pincode,internet, syllabus,medium, projectName,partnerName
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

export const getTotals = asyncHandler(async (req,res)=> {
    try {
        const totalSchool = await School.countDocuments();
        const totalInstructor = await Instructor.countDocuments();
        const totalStudents = await Student.countDocuments();

        return res.status(200).json({success:true,totalSchool,totalInstructor,totalStudents});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})

export const getAllDistricts = asyncHandler(async (req, res) => {
    try {
        const districts = await School.distinct('district');

        const syllabus = await School.distinct('syllabus');
        const medium = await School.distinct('medium');

        return res.status(200).json({ success: true, districts, syllabus,medium });
    } catch (error) {
        console.error("Error fetching districts:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
});

export const getSchoolByDistrictSyllabusMedium = asyncHandler(async (req,res) => {
    try {
        const {district, syllabus, medium } = req.body;
        const schools = await School.find({district,syllabus,medium});

        return res.status(200).json({success:true,schools});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})

export const getAllSchoolsCSV = asyncHandler(async (req,res) => {
    try {
        const schools = await School.find({});
        const csv = parse(schools, { fields: ["name", "principalName", "address", "district", "state", "pincode", "syllabus", "medium", "internet", "projectName", "partnerName", "createdAt", "updatedAt"] });

        res.header('Content-Type', 'text/csv');
        res.attachment('allSchools.csv');
        return res.send(csv);

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})