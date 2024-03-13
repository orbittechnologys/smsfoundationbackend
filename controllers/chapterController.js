import asyncHandler from "express-async-handler";
import Chapter from "../schemas/chapterSchema.js";
import Subject from "../schemas/subjectSchema.js";

export const addChapter = asyncHandler(async (req,res)=> {
    try {
        const {chapterUrl,subjectId,name,desc} = req.body;

        const subjectDoc = await Subject.findById(subjectId);

        if(!subjectDoc){
            console.log("No subject available with the id "+subjectId);
            return res.status(400).json({success:false,msg:"No subject available with the id "+subjectId})
        }

        const chapterDoc = await Chapter.findOne({subject:subjectId, name});
        console.log(chapterDoc);
        if(chapterDoc){
            console.log("Chapter already exists  "+name);
            return res.status(400).json({success:false,msg:"Chapter already exists "+name})
        }

        console.log("Updating chapter count for subject");
        await Subject.updateOne({_id:subjectId},{
            noOfChapter: subjectDoc.noOfChapter + 1
        })

        console.log("Inserting into Chapter")

        const chapter = await Chapter.create({
            chapterUrl,
            name,
            subject:subjectId,
            desc
          });

          return res.status(200).json({success:true,chapter});

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})

export const getChapter = asyncHandler(async (req,res)=> {
    try {
        const chapterId = req.params.chapterId;
        const chapterDoc = await Chapter.findById(chapterId).populate("subject").exec();

        return res.status(200).json(chapterDoc);

    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
})

export const getChaptersBySubject = asyncHandler(async (req,res)=> {
    try {
        const subjectId = req.params.subjectId;
        const chapters = await Chapter.find({subject:subjectId}).populate("subject").exec();

        return res.status(200).json({success:true,chapters});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})