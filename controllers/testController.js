import asyncHandler from "express-async-handler";
import Chapter from "../schemas/chapterSchema.js";
import Test from "../schemas/testSchema.js";
import fs from "fs";
import csv from "csv-parser";
import xlsx from "xlsx";
import Questions from "../schemas/questionsSchema.js";

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

export const uploadTestFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }

  const chapterId = req.params.chapterId;

  try {
    // Check if the chapter already has a test
    const chapterDoc = await Chapter.findById(chapterId).populate("test").exec();
    if (chapterDoc.test) {
      return res.status(400).json({
        success: false,
        message: "Cannot create test, already existing for chapter",
        test: chapterDoc.test,
      });
    }

    const results = [];
    const fileExtension = req.file.originalname.split(".").pop().toLowerCase();

    // Parse the uploaded file
    if (fileExtension === "csv") {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          await processTestData(results, chapterId, req, res);
        });
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      await processTestData(sheetData, chapterId, req, res);
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported file format. Please upload CSV or Excel.",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
  // } finally {
  //   // Clean up uploaded file
  //   if (req.file && fs.existsSync(req.file.path)) {
  //     fs.unlinkSync(req.file.path);
  //   }
  // }
});

// Helper function to process test data
const processTestData = async (testData, chapterId, req, res) => {
  try {
    // Extract test metadata (assuming only one test per file)
    const { name, desc, totalMarks } = testData[0]; // First row for test metadata
    const questionsData = testData.slice(1); // Remaining rows for questions

    // Create the test
    const test = await Test.create({
      name,
      desc,
      noOfQuestions: questionsData.length, // Total questions from file
      totalMarks,
      chapter: chapterId,
    });

    // Create question documents and associate them with the test
    const questions = await Promise.all(
      questionsData.map(async (data) => {
        const { question, optionA, optionB, optionC, optionD, optionE, optionF, pageRef, hint, answer, marks } = data;

        const questionDoc = await Questions.create({
          test: test._id,
          question,
          optionA,
          optionB,
          optionC,
          optionD,
          optionE,
          optionF,
          pageRef: pageRef || 1, // Default to page 1 if not provided
          hint,
          answer,
          marks: marks || 1, // Default marks to 1 if not provided
        });

        return questionDoc;
      })
    );

    // Log the test and questions created
    console.log("Test created and linked to chapter:", name);
    console.log("Questions created:", questions.length);

    // Update the chapter to link the test
    await Chapter.updateOne({ _id: chapterId }, { test: test._id });

    return res.status(200).json({
      success: true,
      message: "Test and questions created successfully",
      test,
      questions,
    });
  } catch (error) {
    console.error("Error processing test data:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Helper function to process test data
/* const processTestData = async (testData, chapterId, req, res) => {
  try {
    // Extract test metadata (assuming only one test per file)
    const { name, desc, totalMarks } = testData[0]; // First row for test metadata
    const questions = testData.slice(1); // Remaining rows for questions

    // Create the test
    const test = await Test.create({
      name,
      desc,
      noOfQuestions: questions.length, // Total questions from file
      totalMarks,
      chapter: chapterId,
    });

    // Update the chapter to link the test
    await Chapter.updateOne({ _id: chapterId }, { test: test._id });

    console.log("Test created and linked to chapter:", name);

    return res
      .status(200)
      .json({ success: true, message: "Test created successfully", test });
  } catch (error) {
    console.error("Error processing test data:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}; */