import asyncHandler from "express-async-handler";
import Test from "../schemas/testSchema.js";
import Questions from "../schemas/questionsSchema.js";

export const addQuestion = asyncHandler(async (req,res)=> {
    try {

        const {
            testId,
            question,
            optionA,
            optionB,
            optionC,
            optionD,
            hint,
            answer,
            marks
        } = req.body;

        const testDoc = await Test.findById(testId);
        if(!testDoc){
            console.log("Test Id does not exist",testId);
            return res.status(400).json({sucess:false,msg:"Test Id does not exist",testId})
        }

        const questionDoc = await Questions.create({
            test:testDoc._id,
            question,
            optionA,
            optionB,
            optionC,
            optionD,
            hint,
            answer,
            marks
          });

          console.log("Question created");

          await Test.updateOne({_id:testDoc._id},{
            noOfQuestions:testDoc.noOfQuestions +1,
            totalMarks:testDoc.totalMarks +marks
          })

          console.log("Updated Test");

          return res.status(200).json({success:true,questionDoc})

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error});
    }
})

export const getQuestionsForTest = asyncHandler(async (req,res)=> {
    try {
        const testId = req.params.testId;
        const questions = await Questions.find({test:testId});

        return res.status(200).json(questions);

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error})
    }
})

export const editQuestion = asyncHandler(async (req,res)=> {

    try {
        const {
            questionId,
            question,
            optionA,
            optionB,
            optionC,
            optionD,
            hint,
            answer
        } = req.body;
    
        const questionDoc = await Questions.findById(questionId);
        if(!questionDoc){
            console.log("No such question ",questionId);
            return res.status(400).json({success:false,"msg":"No such question ",questionId})
        }

        await Questions.updateOne({_id:questionId},{
            question,
            optionA,
            optionB,
            optionC,
            optionD,
            hint,
            answer
        })

        return res.status(200).json({success:true,"msg":"Updated the question "+questionId})

    } catch (error) {
        console.log(error);
        return res.status(500).status({success:false,error})
    }



})