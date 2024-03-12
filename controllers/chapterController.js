import asyncHandler from "express-async-handler";
import Chapter from "../schemas/chapterSchema.js";
import Subject from "../schemas/subjectSchema.js";

export const addChapter = asyncHandler(async (req,res)=> {
    try {
        const {chapterUrl,subjectId,name} = req.body;

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

        const chapter = await Chapter.create({
            chapterUrl,
            name,
            subject:subjectId
          });

          return res.status(200).json({success:true,chapter});

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})