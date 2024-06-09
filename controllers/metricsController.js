import asyncHandler from 'express-async-handler';
import Student from '../schemas/studentSchema.js'
import Chapter from '../schemas/chapterSchema.js';
import Test from '../schemas/testSchema.js';



export const getMetrics = asyncHandler(async (req,res) => {
    try {
        const totalChapters = await Chapter.countDocuments();
        const totalStudents = await Student.countDocuments();
        const totalTests = await Test.countDocuments();
    
        return res.status(200).json({
          success: true,
          data: {
            totalChapters,
            totalStudents,
            totalTests
          }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            error
        })
    }
})