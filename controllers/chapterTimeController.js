import asyncHandler from "express-async-handler";
import Chapter from "../schemas/chapterSchema.js";
import ChapterTime from "../schemas/chapterTimeSchema.js";
import Student from "../schemas/studentSchema.js";
import { convertMinutesToHours } from "../helpers/utils.js";
import Subject from "../schemas/subjectSchema.js";
import SubjectTime from "../schemas/subjectTimeSchema.js";

export const updateChapterTime = asyncHandler(async (req,res)=> {
    try {
        const {chapterId,studentId,time, page, source} = req.body;

        const chapterDoc = await Chapter.findById(chapterId).populate("subject").exec();
        if(!chapterDoc){
            console.log("Invalid chapter id "+chapterId);
            return res.status(400).json({success:false,msg:"Invalid chapter id "+chapterId});
        }

        const studentDoc = await Student.findById(studentId);
        if(!studentDoc){
            console.log("Invalid Student id "+studentId);
            return res.status(400).json({success:false,msg:"Invalid student id "+studentId});
        }

        const subjectDoc = chapterDoc.subject;


        const chapterTimeDoc = await ChapterTime.findOne({student:studentId,chapter:chapterId});
        if(!chapterTimeDoc){
            console.log("Creating new Chapter time");
            const chapterTime = await ChapterTime.create({
                student:studentId,
                chapter:chapterId,
                time,
                page,
                source
              });

            
              await Chapter.updateOne({_id:chapterId},{
                totalHours:chapterDoc.totalHours + convertMinutesToHours(time)
              })
              console.log("Total hours updated on chapter "+chapterDoc.totalHours + convertMinutesToHours(time))

              
        }else{
            console.log("Updating Chapter time");
            await ChapterTime.updateOne({_id:chapterTimeDoc._id},{
                time: chapterTimeDoc.time + time,
                page,
                source,
                updatedAt: new Date()
            })

            await Chapter.updateOne({_id:chapterId},{
                totalHours:Number(chapterDoc.totalHours) + Number(convertMinutesToHours(time))
              })

            console.log("Updated Chapter and chapter time");
           

        }

        const subjectTimeDoc = await SubjectTime.findOne({student:studentId,subject:subjectDoc._id});
        if(!subjectTimeDoc){
            console.log("Creating subject time doc");
            const subjectTime = await SubjectTime.create({
                student:studentId,
                subject:subjectDoc._id,
                time,
                source
            })

            return res.status(200).json({success:true,msg:"Updated chapter and chapter time and created subject time"});

        }else{
            console.log("Updating subject time doc");

            await SubjectTime.updateOne({_id:subjectTimeDoc._id},{
                time: Number(subjectTimeDoc.time) + Number(time),
                source
            })

            return res.status(200).json({success:true,msg:"Updated chapter and chapter time and subject time"});
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})

export const getChapterTimeForStudent = asyncHandler(async (req,res)=> {
    try {
        const studentId = req.params.studentId;

        const chapterTimes = await ChapterTime.find({ student: studentId })
        .populate({
            path: 'chapter',
            populate: {
                path: 'subject',
                model: 'subject'
            }
        })
        .exec();

        return res.status(200).json(chapterTimes);

    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
})

export const getChapterTime = asyncHandler(async (req,res) => {

    try {
        const {studentId,chapterId} = req.body;

    const studentDoc = await Student.findById(studentId);
    if(!studentDoc){
        console.log("Invalid student id:"+studentId);
        return res.status(400).json({success:false,msg:"Invalid student id:"+studentId})
    }

    const chapterDoc = await Chapter.findById(chapterId);
    if(!chapterDoc){
        console.log("Invalid chapter id:"+chapterId);
        return res.status(400).json({success:false,msg:"Invalid chapter id:"+chapterId});
    }

    const chapterTime = await ChapterTime.findOne({chapter:chapterId,student:studentId});

    return res.status(200).json({success:true,chapterTime});

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error})
    }
    
})

export const fetchLatestChapterTime = async (req, res) => {
    try {
      const { studentId } = req.params; // Assuming studentId is passed in req.params
  
      const latestChapter = await ChapterTime.find({ student: studentId }).populate("chapter")
        .sort({ updatedAt: -1 }) // Sort by updatedAt in descending order
        .limit(4); // Limit to 5 documents
  
      res.status(200).json(latestChapter);
    } catch (error) {
      console.error('Error fetching latest student tests:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };