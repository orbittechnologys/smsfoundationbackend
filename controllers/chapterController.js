import asyncHandler from "express-async-handler";
import Chapter from "../schemas/chapterSchema.js";
import Subject from "../schemas/subjectSchema.js";
import ChapterTime from "../schemas/chapterTimeSchema.js";
import Test from "../schemas/testSchema.js";
import Questions from "../schemas/questionsSchema.js";
import Student from "../schemas/studentSchema.js";

export const addChapter = asyncHandler(async (req, res) => {
  try {
    const { chapterUrl, audioUrl, videoUrl, subjectId, name, desc, subtitle, thumbnail } = req.body;

    console.log(audioUrl, videoUrl);

    if (!Array.isArray(videoUrl)) {
      return res
        .status(400)
        .json({ success: false, msg: "videoUrl should be an array" });
    }

    const subjectDoc = await Subject.findById(subjectId);

    if (!subjectDoc) {
      console.log("No subject available with the id " + subjectId);
      return res
        .status(400)
        .json({
          success: false,
          msg: "No subject available with the id " + subjectId,
        });
    }

    const chapterDoc = await Chapter.findOne({ subject: subjectId, name });
    console.log(chapterDoc);
    if (chapterDoc) {
      console.log("Chapter already exists  " + name);
      return res
        .status(400)
        .json({ success: false, msg: "Chapter already exists " + name });
    }

    console.log("Updating chapter count for subject");
    await Subject.updateOne(
      { _id: subjectId },
      {
        noOfChapter: subjectDoc.noOfChapter + 1,
      }
    );

    console.log("Inserting into Chapter");

    const chapter = await Chapter.create({
      chapterUrl,
      audioUrl,
      videoUrl,
      name,
      subject: subjectId,
      desc,
      subtitle,
      thumbnail, 
    });

    return res.status(200).json({ success: true, chapter });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
});

export const getChapter = asyncHandler(async (req, res) => {
  try {
    const chapterId = req.params.chapterId;
    const chapterDoc = await Chapter.findById(chapterId)
      .populate("subject")
      .exec();

    return res.status(200).json(chapterDoc);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

export const getChaptersBySubject = asyncHandler(async (req, res) => {
  try {
    const subjectId = req.params.subjectId;
    const chapters = await Chapter.find({ subject: subjectId })
      .populate("subject")
      .exec();

    return res.status(200).json({ success: true, chapters });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
});

/* export const getChapterQuery = asyncHandler(async (req, res) => {
  try {
    const query = req.params.query;
    const regexPattern = new RegExp(query, "i");

    const chapters = await Chapter.find({
      name: { $regex: regexPattern },
    })
      .populate("subject")
      .exec();

    return res.status(200).json({ success: true, chapters });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
}); */

export const getChapterQuery = asyncHandler(async (req, res) => {
  try {
    const query = req.params.query;
    const studentClass = req.query.class; 
    const regexPattern = new RegExp(query, "i");

    const chapters = await Chapter.find({
      name: { $regex: regexPattern },
    })
      .populate({
        path: "subject",
        match: { standard: studentClass }, 
      })
      .exec();

    const filteredChapters = chapters.filter(chapter => chapter.subject);
    if(!chapters){
      return res.status(404).json({ success: false, msg: "No chapters found" });
    }

    return res.status(200).json({ success: true, chapters: filteredChapters });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
});


export const updateChapter = asyncHandler(async (req, res) => {
  try {
    const { chapterId, name, desc, subtitle, chapterUrl, audioUrl, videoUrl, thumbnail } = req.body;

    let chapterDoc = await Chapter.findById(chapterId);
    if (!chapterDoc) {
      return res.status(400).json({
        success: false,
        msg: "Invalid chapter id: " + chapterId,
      });
    }

    chapterDoc.name = name || chapterDoc.name;
    chapterDoc.desc = desc || chapterDoc.desc;
    chapterDoc.subtitle = subtitle || chapterDoc.subtitle;
    chapterDoc.chapterUrl = chapterUrl || chapterDoc.chapterUrl;
    chapterDoc.audioUrl = audioUrl || chapterDoc.audioUrl;
    chapterDoc.videoUrl = Array.isArray(videoUrl) ? videoUrl : chapterDoc.videoUrl;
    chapterDoc.thumbnail = thumbnail || chapterDoc.thumbnail;

    chapterDoc = await chapterDoc.save();

    return res.status(200).json({
      msg: "Chapter updated successfully",
      success: true,
      chapterDoc,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
});

export const deleteChapter = asyncHandler(async (req,res) => {
  try {
    const chapterId = req.params.id;

    let chapterDoc = await Chapter.findById(chapterId);
    if(!chapterDoc){
      return res.status(400).json({
        success:false,
        msg:"Invalid chapter id :"+chapterId
      })
    }
      await ChapterTime.deleteMany({ chapter: chapterId });

      let tests = await Test.find({ chapter: chapterId });

      for (let test of tests) {
        await Questions.deleteMany({ test: test._id }); //only will be called once
      }

      await Test.deleteMany({ chapter: chapterId });

      await Chapter.findByIdAndDelete(chapterId);

      return res.status(200).json({
        success: true,
        msg: "Chapter and related data deleted successfully",
      });


  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error });
  }
})

export const getChapterTestsByStudentId = asyncHandler(async (req, res) => {
  try {
    const studentId = req.params.studentId;
    
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ success: false, msg: "Student not found" });
    }

    const studentDetails = {
      firstName: student.firstName,
      lastName: student.lastName,
      standard: student.standard,
      syllabus: student.syllabus,
      medium: student.medium
    };

    const subjects = await Subject.find({
      standard: student.standard,
      syllabus: student.syllabus,
      medium: student.medium
    });

    if (!subjects || subjects.length === 0) {
      return res.status(404).json({ success: false, msg: "No subjects found for the student's standard, syllabus, and medium" });
    }

    const chapterTests = await Chapter.find({
      subject: { $in: subjects.map(subject => subject._id) },
      test: { $ne: null } // Ensure test is not null
    }).populate('subject').populate('test');

    if (!chapterTests || chapterTests.length === 0) {
      return res.status(404).json({ success: false, msg: "No chapters with tests found for this student" });
    }

    return res.status(200).json({
      success: true,
      student: studentDetails,
      chaptersWithTests: chapterTests
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, error: error.message });
  }
});
