import asyncHandler from "express-async-handler";
import Chapter from "../schemas/chapterSchema.js";
import Test from "../schemas/testSchema.js";

export const addTest = asyncHandler(async (req, res) => {
  try {
    const { chapterId, testName, desc } = req.body;

    const chapterDoc = await Chapter.findById(chapterId).populate("test").exec();

    if (chapterDoc.test) {
      console.log("Cannot create test already existing for chapter");
      return res
        .status(400)
        .json({
          test: chapterDoc.test,
          msg: "Cannot create test already existing for chapter",
        });
    }

    const test = await Test.create({
        name:testName,
        desc,
        chapter:chapterId,
      });

      console.log("created test",testName)

      await Chapter.updateOne({_id:chapterId},{
        test:test._id
      })

      console.log("Updated chapter");

    return res.status(200).json({success:true, test});


  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});


export const getTestByChapter = asyncHandler(async (req,res)=> {
    try {
        const chapterId = req.params.chapterId;
        console.log("for chapter Id",chapterId);
        const test = await Test.findOne({"chapter":chapterId});
        console.log(test,"for chapter Id",chapterId);

        return res.status(200).json({success:true,test});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})

export const getTest = asyncHandler(async (req,res)=> {
    try {
        const testId = req.params.testId;
        const test = await Test.findById(testId);
        if(!test){
            console.log("No test found "+testId);
            return res.status(400).json({success:false,msg:"No test found "+testId})
        }
        return res.status(200).json({success:true,test});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})